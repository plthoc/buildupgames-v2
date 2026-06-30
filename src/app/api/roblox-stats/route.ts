import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
// Always fetch fresh — no ISR cache. Client polls every 30s for live updates.
export const dynamic = "force-dynamic";

type GameStats = {
  placeId: number;
  universeId: number;
  playing: number;
  visits: number;
  name: string;
  favoritedCount: number;
  thumbnail: string;
  updatedAt: number;
};

// Cache placeId → universeId permanently (mapping is immutable).
const universeIdCache = new Map<number, number>();

async function placeToUniverseId(placeId: number): Promise<number | null> {
  if (universeIdCache.has(placeId)) return universeIdCache.get(placeId)!;
  try {
    const r = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 * 30 }, // 30 days
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { universeId?: number };
    if (!data.universeId) return null;
    universeIdCache.set(placeId, data.universeId);
    return data.universeId;
  } catch (e) {
    console.error("[roblox-stats] placeToUniverseId failed", e);
    return null;
  }
}

async function fetchGameStats(universeId: number): Promise<{
  playing: number;
  visits: number;
  name: string;
  favoritedCount: number;
} | null> {
  try {
    const url = `https://games.roblox.com/v1/games?universeIds=${universeId}`;
    const r = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!r.ok) {
      console.error(`[roblox-stats] universe ${universeId} returned ${r.status}`);
      return null;
    }
    const data = (await r.json()) as {
      data: Array<{
        id: number;
        name: string;
        playing: number;
        visits: number;
        favoritedCount: number;
      }>;
    };
    const game = data?.data?.[0];
    if (!game) return null;
    return {
      playing: game.playing ?? 0,
      visits: game.visits ?? 0,
      name: game.name ?? "",
      favoritedCount: game.favoritedCount ?? 0,
    };
  } catch (e) {
    console.error("[roblox-stats] fetch failed", e);
    return null;
  }
}

async function fetchGameThumbnails(universeIds: number[]): Promise<Map<number, string>> {
  const out = new Map<number, string>();
  if (universeIds.length === 0) return out;
  try {
    const url =
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails` +
      `?universeIds=${universeIds.join(",")}` +
      `&countPerUniverse=1&defaults=true` +
      `&size=768x432&format=Png&isCircular=false`;
    const r = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 6 }, // 6h — game thumbnails rarely change
    });
    if (!r.ok) {
      console.error(`[roblox-stats] thumbnails returned ${r.status}`);
      return out;
    }
    const data = (await r.json()) as {
      data?: Array<{
        universeId: number;
        thumbnails?: Array<{ imageUrl?: string; state?: string }>;
      }>;
    };
    for (const entry of data.data ?? []) {
      const thumb = entry.thumbnails?.find((t) => t.imageUrl && t.state === "Completed");
      if (thumb?.imageUrl) out.set(entry.universeId, thumb.imageUrl);
    }
  } catch (e) {
    console.error("[roblox-stats] thumbnails fetch failed", e);
  }
  return out;
}

export async function GET() {
  const results: GameStats[] = [];

  // Step 1: collect (placeId, universeId, stats) for every configured game
  const collected: Array<{
    placeId: number;
    universeId: number;
    stats: { playing: number; visits: number; name: string; favoritedCount: number };
  }> = [];

  for (const game of siteConfig.games) {
    if (!game.placeId) continue;
    const universeId = await placeToUniverseId(game.placeId);
    if (!universeId) continue;
    const stats = await fetchGameStats(universeId);
    if (stats) collected.push({ placeId: game.placeId, universeId, stats });
  }

  // Step 2: batch-fetch thumbnails for all universes in one call
  const thumbMap = await fetchGameThumbnails(collected.map((c) => c.universeId));

  // Step 3: build final results
  for (const c of collected) {
    results.push({
      placeId: c.placeId,
      universeId: c.universeId,
      name: c.stats.name || siteConfig.games.find((g) => g.placeId === c.placeId)?.name || "",
      playing: c.stats.playing,
      visits: c.stats.visits,
      favoritedCount: c.stats.favoritedCount,
      thumbnail: thumbMap.get(c.universeId) ?? "",
      updatedAt: Date.now(),
    });
  }

  const total = results.reduce(
    (acc, g) => ({ playing: acc.playing + g.playing, visits: acc.visits + g.visits }),
    { playing: 0, visits: 0 },
  );

  const byGame: Record<
    number,
    { playing: number; visits: number; name: string; favoritedCount: number; thumbnail: string; updatedAt: number }
  > = {};
  for (const g of results) {
    byGame[g.placeId] = {
      playing: g.playing,
      visits: g.visits,
      name: g.name,
      favoritedCount: g.favoritedCount,
      thumbnail: g.thumbnail,
      updatedAt: g.updatedAt,
    };
  }

  return NextResponse.json(
    { total, byGame },
    {
      headers: {
        // Live CCU must be exact. No browser/CDN cache — every poll returns fresh data.
        "Cache-Control": "no-store, must-revalidate",
      },
    },
  );
}
"use client";

import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { GameCard, type GameCardData } from "@/components/ui/game-card";
import { usePollWithCountdown } from "@/lib/use-poll-with-countdown";

type GameStats = {
  playing: number;
  visits: number;
  name: string;
  favoritedCount: number;
  thumbnail: string;
  updatedAt: number;
};

const POLL_INTERVAL_SEC = 60; // refresh live CCU every minute, wall-clock aligned

export function GamesGrid({
  limit,
  showHeader = false,
}: {
  /** Cap how many games are shown. `undefined` = all. */
  limit?: number;
  /** Show a tiny "live" indicator above the grid. */
  showHeader?: boolean;
}) {
  // Live CCU + thumbnails + titles — exact numbers, refreshed every minute.
  const { data } = usePollWithCountdown<{
    byGame: Record<number, GameStats>;
  }>(
    async () => {
      const r = await fetch("/api/roblox-stats", { cache: "no-store" });
      if (!r.ok) throw new Error("bad response");
      return (await r.json()) as { byGame: Record<number, GameStats> };
    },
    POLL_INTERVAL_SEC,
  );

  const statsById = data?.byGame ?? {};
  const loaded = data !== null;

  // Merge config + live stats, sort by CCU desc (stable fallback to config order)
  const games: GameCardData[] = useMemo(() => {
    const merged = siteConfig.games.map((g) => {
      const s = statsById[g.placeId];
      return {
        placeId: g.placeId,
        name: s?.name ?? g.name,
        studio: g.studio,
        url: g.url,
        tag: g.tag,
        img: s?.thumbnail ?? g.img,
        playing: s?.playing ?? 0,
        visits: s?.visits ?? 0,
      } as GameCardData;
    });

    merged.sort((a, b) => {
      if (b.playing !== a.playing) return b.playing - a.playing;
      const ai = siteConfig.games.findIndex((g) => g.placeId === a.placeId);
      const bi = siteConfig.games.findIndex((g) => g.placeId === b.placeId);
      return ai - bi;
    });

    return typeof limit === "number" ? merged.slice(0, limit) : merged;
  }, [statsById, limit]);

  if (games.length === 0) return null;

  return (
    <div>
      {showHeader && (
        <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-500">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span>Live · sorted by current players</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {games.map((game, i) => (
            <GameCard
              key={game.placeId}
              game={game}
              // only the first 3 cards (top of the grid) get eager loading
              // after the API has loaded; otherwise all cards load lazily
              eager={i < 3 && loaded}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
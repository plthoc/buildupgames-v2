import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
// Cache for 5 minutes — username/avatar rarely change, but not too stale.
const REVALIDATE_SECONDS = 300;

type UserInfo = {
  userId: number;
  name: string;
  displayName: string;
  avatarUrl: string;
  hasVerifiedBadge: boolean;
};

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids") ?? "";
  const requested = idsParam
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (requested.length === 0) {
    return NextResponse.json({ users: [] }, { status: 400 });
  }

  // Merge with any configured userIds we may not have been asked about
  const allIds = Array.from(
    new Set([
      ...requested,
      ...siteConfig.team.members
        .map((m) => m.robloxUserId)
        .filter((n): n is number => typeof n === "number"),
    ]),
  );

  const users = await fetchAll(allIds);

  return NextResponse.json(
    { users },
    {
      headers: {
        "Cache-Control": `public, max-age=${REVALIDATE_SECONDS}, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
      },
    },
  );
}

async function fetchAll(userIds: number[]): Promise<UserInfo[]> {
  if (userIds.length === 0) return [];

  // Step 1: lookup name + displayName + hasVerifiedBadge
  let userDetails: Array<{
    id: number;
    name: string;
    displayName: string;
    hasVerifiedBadge: boolean;
  }> = [];
  try {
    const url = `https://users.roblox.com/v1/users`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ userIds, excludeBannedUsers: false }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (r.ok) {
      const data = (await r.json()) as { data?: typeof userDetails };
      userDetails = data.data ?? [];
    } else {
      console.error(`[roblox-user] users lookup returned ${r.status}`);
    }
  } catch (e) {
    console.error("[roblox-user] users lookup failed", e);
  }

  // Step 2: avatar thumbnails (batch)
  const avatarMap = new Map<number, string>();
  try {
    const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds.join(",")}&size=420x420&format=Png&isCircular=false`;
    const r = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (r.ok) {
      const data = (await r.json()) as {
        data?: Array<{ targetId: number; imageUrl?: string; state?: string }>;
      };
      for (const entry of data.data ?? []) {
        if (entry.imageUrl) avatarMap.set(entry.targetId, entry.imageUrl);
      }
    } else {
      console.error(`[roblox-user] thumbnails returned ${r.status}`);
    }
  } catch (e) {
    console.error("[roblox-user] thumbnails fetch failed", e);
  }

  return userIds.map((id) => {
    const details = userDetails.find((u) => u.id === id);
    return {
      userId: id,
      name: details?.name ?? "",
      displayName: details?.displayName ?? "",
      avatarUrl: avatarMap.get(id) ?? "",
      hasVerifiedBadge: details?.hasVerifiedBadge ?? false,
    };
  });
}

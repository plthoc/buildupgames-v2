"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { GameCard, type GameCardData } from "@/components/ui/game-card";

type GameStats = {
  playing: number;
  visits: number;
  name: string;
  favoritedCount: number;
  thumbnail: string;
  updatedAt: number;
};

export function GamesGrid({
  limit,
  showHeader = false,
}: {
  /** Cap how many games are shown. `undefined` = all. */
  limit?: number;
  /** Show a tiny "live" indicator above the grid. */
  showHeader?: boolean;
}) {
  const [statsById, setStatsById] = useState<Record<number, GameStats>>({});
  const [loaded, setLoaded] = useState(false);

  // Poll every 30s for live CCU + thumbnails + titles
  useEffect(() => {
    let alive = true;
    const poll = () => {
      fetch("/api/roblox-stats")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (alive && data?.byGame) {
            setStatsById(data.byGame);
            setLoaded(true);
          }
        })
        .catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 30000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

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

    // Sort: highest CCU first; ties fall back to original config order.
    merged.sort((a, b) => {
      if (b.playing !== a.playing) return b.playing - a.playing;
      // Stable tie-break: we keep the original config order via placeId position
      const ai = siteConfig.games.findIndex((g) => g.placeId === a.placeId);
      const bi = siteConfig.games.findIndex((g) => g.placeId === b.placeId);
      return ai - bi;
    });

    const sorted = merged;
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
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

      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {games.map((game, i) => (
            <motion.div
              key={game.placeId}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 },
                y: { duration: 0.4 },
              }}
            >
              <GameCard game={game} priority={i < 3 && loaded} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
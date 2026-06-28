"use client";

import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

export type GameCardData = {
  placeId: number;
  name: string;
  studio: string;
  url: string;
  tag: string;
  img: string;
  playing: number;
  visits: number;
};

export function GameCard({
  game,
  priority = false,
}: {
  game: GameCardData;
  priority?: boolean;
}) {
  const { name, img, url, playing, visits } = game;

  return (
    <motion.a
      layout
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group block overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card focus-ring"
    >
      {/* Thumbnail — plain <img> instead of next/image:
          Roblox CDN requires browser-like headers and Vercel's optimizer
          can fail silently. The image is already pre-sized by Roblox. */}
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-50">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={name}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-50 to-line" />
        )}

        {/* Live CCU badge — top-left of image */}
        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span>{formatNumber(playing)}+ playing</span>
        </div>
      </div>

      {/* Meta */}
      <div className="px-5 py-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 line-clamp-2">
          {name}
        </h3>
        <p className="mt-2 text-sm text-ink-500">
          <span className="font-semibold text-ink-900">{formatNumber(visits)}+</span> visits
        </p>
      </div>
    </motion.a>
  );
}
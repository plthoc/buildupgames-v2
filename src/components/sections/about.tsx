"use client";

import Image from "next/image";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion-primitives";
import { siteConfig } from "@/lib/site-config";
import { formatNumber } from "@/lib/utils";
import { usePollWithCountdown } from "@/lib/use-poll-with-countdown";

type LiveStats = {
  playing: number;
  visits: number;
  favoritedCount: number;
};

const POLL_INTERVAL_SEC = 60; // refresh live CCU every minute, wall-clock aligned

export function About() {
  // Pull live totals from the same endpoint the Hero / GamesGrid use
  const { data, secondsUntilNext } = usePollWithCountdown<{
    total: { playing: number; visits: number };
    byGame: Record<number, { favoritedCount: number }>;
  }>(
    async () => {
      const r = await fetch("/api/roblox-stats", { cache: "no-store" });
      if (!r.ok) throw new Error("bad response");
      return (await r.json()) as {
        total: { playing: number; visits: number };
        byGame: Record<number, { favoritedCount: number }>;
      };
    },
    POLL_INTERVAL_SEC,
  );

  const stats: LiveStats | null = data
    ? (() => {
        const totalFavorites = Object.values(data.byGame).reduce(
          (acc, g) => acc + (g.favoritedCount ?? 0),
          0,
        );
        return {
          playing: data.total.playing,
          visits: data.total.visits,
          favoritedCount: totalFavorites,
        };
      })()
    : null;

  const pills: Array<{ value: string; label: string; sub: string }> = [
    {
      value: stats ? formatNumber(stats.playing) : "—",
      label: "Live CCU",
      sub: "across portfolio",
    },
    {
      value: stats ? formatNumber(stats.visits) : "—",
      label: "Visits",
      sub: "lifetime",
    },
    {
      value: stats ? formatNumber(stats.favoritedCount) : "—",
      label: "Favorites",
      sub: "from players",
    },
    {
      value: String(siteConfig.games.length),
      label: "Games",
      sub: "in network",
    },
  ];

  return (
    <section
      id="about"
      className="surface-light relative section-pad"
    >
      <div className="container-x">
        {/* Section heading — single line, matches reference */}
        <Reveal>
          <h2 className="font-display text-display-md font-medium tracking-tight text-ink-900 text-balance">
            We help build Roblox{" "}
            <span className="serif-italic">experiences</span> that matter most.
          </h2>
        </Reveal>

        {/* Two-column block: image card on left, copy on right */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left — image card (16:10, matches reference proportions) */}
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-4xl bg-ink-900">
              <Image
                src="/images/IMG_0136.png"
                alt="BuildUp"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                unoptimized
              />
            </div>
          </Reveal>

          {/* Right — copy */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="flex items-center gap-3">
                <div className="eyebrow text-ink-500">Our Approach</div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-500">
                  <span className="relative inline-flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Live · {secondsUntilNext}s
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="mt-4 font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink-900 text-balance md:text-4xl">
                Turning ideas into games that keep players coming back.
              </h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-base leading-relaxed text-ink-500 text-pretty">
                We work across strategy, design, and engineering to help studios
                ship Roblox games that grow — without sacrificing quality.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-4 text-base leading-relaxed text-ink-500 text-pretty">
                Every project is shaped by real player needs, strong creative
                direction, and systems built to scale over time.
              </p>
            </Reveal>

            <RevealStagger className="mt-10 grid grid-cols-2 gap-3">
              {pills.map((pill) => (
                <RevealItem key={pill.label}>
                  <PillStat {...pill} />
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </div>
      </div>
    </section>
  );
}

function PillStat({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="font-display text-2xl font-medium text-ink-900 md:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-ink-900">{label}</div>
      <div className="mt-0.5 text-xs text-ink-500">{sub}</div>
    </div>
  );
}
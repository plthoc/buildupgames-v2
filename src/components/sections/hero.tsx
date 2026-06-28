"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { formatNumber } from "@/lib/utils";

type Stats = { playing: number; visits: number } | null;

export function Hero() {
  const [stats, setStats] = useState<Stats>(null);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  // Poll every 30s for live CCU + visits
  useEffect(() => {
    let alive = true;
    const poll = () => {
      fetch("/api/roblox-stats")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (alive && data) setStats(data.total); })
        .catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => { alive = false; clearInterval(interval); };
  }, []);

  return (
    <section id="top" className="surface-hero relative isolate min-h-[100svh] overflow-hidden">
      {/* Background image — blurred + faded, behind everything */}
      <motion.div
        aria-hidden
        style={{ y: yBg, opacity }}
        className="absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 blur-md scale-110"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Dark overlay so the image never overwhelms the copy */}
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Vignettes */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col justify-center pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="font-display text-display-lg font-medium tracking-tight text-white text-balance"
          >
            Building games<br />
            <span className="serif-italic">worth</span> playing.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="mt-6 max-w-md text-base text-white/70"
          >
            Where Roblox ideas come alive — through publishing, design, and live operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#contact" className="btn-pill btn-light focus-ring">Get Started</a>
            <a href="#about" className="btn-pill btn-ghost text-white focus-ring">Learn More</a>
          </motion.div>
        </div>

        {/* Live Roblox stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
          className="mt-14 grid max-w-sm grid-cols-2 gap-3"
        >
          <StatCard value={formatNumber(stats?.playing ?? 0)} label="Total CCU" loading={stats === null} />
          <StatCard value={formatNumber(stats?.visits ?? 0)} label="Total Visits" loading={stats === null} />
        </motion.div>
      </div>

    </section>
  );
}

function StatCard({ value, label, loading }: { value: string; label: string; loading?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="font-display text-3xl font-medium text-white">
        {loading ? <span className="inline-block w-12 animate-pulse rounded bg-white/10" /> : value}
      </div>
      <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}

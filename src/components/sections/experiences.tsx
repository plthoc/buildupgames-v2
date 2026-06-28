"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion-primitives";
import { GamesGrid } from "@/components/sections/games-grid";

export function Experiences() {
  const hasGames = siteConfig.games.length > 0;

  return (
    <section
      id="experiences"
      className="surface-white relative section-pad"
    >
      <div className="container-x">
        <Reveal>
          <div className="eyebrow text-ink-500">{siteConfig.experiences.eyebrow}</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-3 font-display text-display-md font-medium tracking-tight text-ink-900 text-balance">
            <span className="serif-italic">Featured</span> Experiences.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-lg text-ink-500 text-pretty">
            {siteConfig.experiences.subtitle}
          </p>
        </Reveal>

        {hasGames ? (
          <div className="mt-16">
            <GamesGrid limit={3} />
            <Reveal>
              <div className="mt-10 flex justify-center">
                <a
                  href="/games"
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink-900 transition-all hover:border-ink-300 hover:shadow-card focus-ring"
                >
                  View all games
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </Reveal>
          </div>
        ) : (
          <RevealStagger className="mt-16">
            <RevealItem>
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-4xl border border-line bg-white p-8 text-center">
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-white">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-medium text-ink-900">
                  No published game yet
                </h3>
                <p className="mt-2 max-w-xs text-sm text-ink-500">
                  We don&apos;t own any Roblox game yet. Contact us if you want to be the first to publish with us!
                </p>
              </div>
            </RevealItem>
          </RevealStagger>
        )}

        {/* "Pitch your experience" — always present, sits below the grid */}
        <Reveal>
          <motion.a
            href="#contact"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 group flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface-50 p-8 text-center transition-colors hover:border-ink-300 hover:bg-white focus-ring"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-ink-900 text-white">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-medium text-ink-900">
              Pitch your experience
            </h3>
            <p className="mt-2 max-w-md text-sm text-ink-500">
              Always looking for the next hit. If you&apos;re building something players will love, we want to hear about it.
            </p>
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}
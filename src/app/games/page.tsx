import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { GamesGrid } from "@/components/sections/games-grid";
import { Reveal } from "@/components/ui/motion-primitives";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://buildupgames.cc";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Every experience published by BuildUp Games — live player counts, visits, and direct links. Sorted in real time by who's playing right now.",
  alternates: { canonical: `${siteUrl}/games` },
};

export default function GamesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="surface-white relative section-pad pb-10">
          <div className="container-x">
            <Reveal>
              <div className="eyebrow text-ink-500">Catalog</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-3 font-display text-display-lg font-medium tracking-tight text-ink-900 text-balance">
                <span className="serif-italic">All</span> our games.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-2xl text-lg text-ink-500 text-pretty">
                Every experience BuildUp publishes. Cards reorder themselves by live
                concurrent players — the most active game sits at the top.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Grid */}
        <section className="surface-white pb-24 md:pb-32">
          <div className="container-x">
            <GamesGrid showHeader />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
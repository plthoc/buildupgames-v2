"use client";

import { usePathname } from "next/navigation";
import { Twitter, MessageCircle, Globe } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/lib/site-config";
import { resolveNavHref } from "@/lib/utils";
import { Reveal } from "@/components/ui/motion-primitives";

export function Footer() {
  const pathname = usePathname() ?? "/";
  return (
    <footer className="relative overflow-hidden bg-[#19236a] text-white">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <Logo height={32} />
                <span className="text-[15px] font-semibold tracking-tight text-white">
                </span>
              </div>
              <h2 className="mt-8 max-w-xl font-display text-display-sm font-medium tracking-tight text-white text-balance">
                Let&apos;s build the <span className="serif-italic">next</span> great Roblox game.
              </h2>
            </div>
            <a
              href="#contact"
              className="btn-pill btn-light focus-ring"
            >
              Get Started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-white/10 pt-10 md:grid-cols-4">
          <div className="col-span-2">
            <div className="text-[11px] font-medium uppercase tracking-wider text-white/40">
              {siteConfig.footer.copyright}
            </div>
            <div className="mt-2 text-sm text-white/60">
              {siteConfig.footer.built}
            </div>
          </div>

          <div>
            <div className="eyebrow text-white/40">Navigate</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={resolveNavHref(item.href, pathname)}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow text-white/40">Connect</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={siteConfig.social.roblox}
                  className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Roblox
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.twitter}
                  className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                >
                  <Twitter className="h-3.5 w-3.5" />
                  X / Twitter
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.discord}
                  className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

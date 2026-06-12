"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experiences", href: "#experiences" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Full-width navbar - blue background */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#19236a] border-b border-[#0f1643]/40">
        {/* Logo — left */}
        <motion.a
          href="#top"
          className="pointer-events-auto flex shrink-0 items-center focus-ring rounded-lg px-2 py-1"
          aria-label="BuildUp home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <Logo height={24} priority />
        </motion.a>

        {/* Nav links — center */}
        <motion.ul
          className="pointer-events-auto hidden md:flex items-center gap-0.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:text-white focus-ring"
              >
                {item.label}
              </a>
            </li>
          ))}
        </motion.ul>

        {/* Discord CTA Button — right */}
        <motion.a
          href="https://discord.gg/buildup"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto group hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/40"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <span className="inline-flex h-4 w-4 items-center justify-center">
            <svg
              viewBox="0 0 127 127"
              className="h-4 w-4 text-white transition-transform duration-300 ease-out group-hover:[animation:discord-wave_1.6s_ease-in-out_infinite]"
              fill="currentColor"
              aria-hidden="true"
              style={{ transformOrigin: "50% 80%" }}
            >
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36a77.7,77.7,0,0,0,6.89-11.18A68.42,68.42,0,0,1,28.88,76.8c.585-.445,1.15-.9,1.7-1.36a77.06,77.06,0,0,0,66.83,0c.52.46,1.08.917,1.67,1.39a68.68,68.68,0,0,1-11.01,9.73,76.21,76.21,0,0,0,6.89,11.08A105.5,105.5,0,0,0,126.75,80.21h0C129.77,55.03,122.74,31.16,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60.55,31,53.88s5.07-11.86,11.45-11.86c6.39,0,11.63,5.29,11.52,11.86,0,6.67-5.15,11.81-11.48,11.81Zm42.97,0C79.15,65.69,74,60.55,74,53.88s5.07-11.86,11.45-11.86c6.44,0,11.66,5.29,11.52,11.86,0,6.67-5.15,11.81-11.48,11.81Z" />
            </svg>
          </span>
          <span>Join Discord</span>
        </motion.a>
      </header>

      {/* Mobile menu: hamburger toggle button top-right, full-screen dark overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            {/* Mobile hamburger button — top-right corner */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white transition-all focus-ring"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-full flex-col items-center justify-center gap-8 p-8"
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 + i * 0.07 }}
                  className="font-display text-5xl font-medium text-white focus-ring"
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile only: hamburger button — top-right, shown when menu closed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 top-4 z-40 grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/20 bg-[#19236a] text-white transition-all focus-ring md:hidden"
          aria-label="Open menu"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </>
  );
}

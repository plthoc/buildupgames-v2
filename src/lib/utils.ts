import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number | string | null | undefined) {
  const num = typeof n === "string" ? Number(n) : n;
  if (!num || Number.isNaN(num)) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toLocaleString();
}

/** Exact number with thousands separators — no rounding (e.g. 12,347). */
export function formatExact(n: number | string | null | undefined) {
  const num = typeof n === "string" ? Number(n) : n;
  if (num === null || num === undefined || Number.isNaN(num)) return "0";
  return Math.trunc(num).toLocaleString();
}

/**
 * Resolve a nav href for the current page.
 * - On the home page (`/`), in-page anchors (#about) work natively and get
 *   smoothly scrolled by the SmoothScroll provider.
 * - On any other page, an in-page anchor must be turned into a full path
 *   (e.g. `/#about`) so the browser loads home first and then jumps to
 *   the section.
 */
export function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}

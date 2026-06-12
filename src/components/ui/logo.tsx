"use client";

import Image from "next/image";

/**
 * Logo — uses the brand's "BuildUp" wordmark (transparent background).
 * PNG is the default; SVG fallback also lives in /public.
 *
 * Heights are tuned so the wordmark sits naturally next to nav links.
 */
export function Logo({
  height = 28,
  className,
  priority = false,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="BuildUp"
      width={height * (226 / 122)}
      height={height}
      className={className}
      style={{ height, width: "auto", display: "block" }}
      priority={priority}
    />
  );
}

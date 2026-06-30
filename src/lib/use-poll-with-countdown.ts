"use client";

import { useEffect, useState } from "react";

/**
 * Polls `fetcher` once on mount, then again every `intervalSec` seconds on a
 * wall-clock-aligned cadence. The fetch countdown is internal-only — it is
 * not surfaced to the UI. The first fetch happens immediately; every
 * subsequent fetch lands on a global boundary (e.g. for `intervalSec = 60`,
 * fetches land at :00 of each minute in the user's local clock).
 */
export function usePollWithCountdown<T>(
  fetcher: () => Promise<T>,
  intervalSec = 60,
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        const result = await fetcher();
        if (!alive) return;
        setData(result);
        setError(false);
        setLastUpdatedAt(Date.now());
      } catch {
        if (!alive) return;
        setError(true);
      }
    };

    // Initial fetch on mount.
    run();

    // Schedule subsequent fetches on wall-clock boundaries.
    // Recursive setTimeout so each refresh lands exactly on the next
    // boundary regardless of how long the previous fetch took.
    const secondsToNextBoundary = () => {
      const phase = Math.floor((Date.now() / 1000) % intervalSec);
      return phase === 0 ? intervalSec : intervalSec - phase;
    };

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      timeoutId = setTimeout(() => {
        run();
        schedule();
      }, intervalSec * 1000);
    };

    timeoutId = setTimeout(() => {
      run();
      schedule();
    }, secondsToNextBoundary() * 1000);

    return () => {
      alive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalSec]);

  return { data, error, lastUpdatedAt };
}

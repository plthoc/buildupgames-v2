"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Polls `fetcher` once on mount, then again every `intervalSec` seconds on a
 * wall-clock-aligned cadence. Exposes a `secondsUntilNext` value that is
 * recomputed every second from the real clock — it cannot "reset on refresh":
 * every render the value reflects actual time remaining until the next
 * global boundary (e.g. for `intervalSec = 60`, seconds until the next `:00`).
 */
export function usePollWithCountdown<T>(
  fetcher: () => Promise<T>,
  intervalSec = 60,
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  // Ticking "now" — recomputed every second. This is the source of truth for
  // the displayed countdown. It is independent of when the tab mounted.
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Seconds remaining until the next boundary at `intervalSec`. Because
  // `now` ticks every second, this value stays in sync with real time even
  // if the user keeps the tab open across multiple update cycles.
  const secondsUntilNext = useMemo(() => {
    const phase = Math.floor((now / 1000) % intervalSec);
    return phase === 0 ? intervalSec : intervalSec - phase;
  }, [now, intervalSec]);

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

    // Schedule every subsequent fetch on a wall-clock boundary.
    // Recursive setTimeout so each refresh lands exactly on the boundary,
    // independent of how long the previous fetch took.
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

  return { data, error, lastUpdatedAt, secondsUntilNext };
}

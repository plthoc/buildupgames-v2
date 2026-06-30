"use client";

import { useEffect, useState } from "react";

/**
 * Polls `fetcher` on a wall-clock-aligned cadence and exposes a 1-second
 * resolution countdown to the next fetch.
 *
 * The first fetch happens immediately on mount. Every subsequent fetch is
 * scheduled to land on a global boundary — e.g. for `intervalSec = 60` the
 * polls land at :00 of every minute in the user's local clock. The visible
 * countdown matches that same clock, so refreshing the page at any moment
 * shows the correct remaining seconds (not a fresh 60).
 *
 * - `data`             — latest successful payload (null until first fetch).
 * - `error`            — true if the last poll failed.
 * - `secondsUntilNext` — ticks down to 0 each second; resets to `intervalSec`
 *                        the instant a fresh fetch lands.
 * - `lastUpdatedAt`    — epoch ms of the most recent successful fetch.
 */
export function usePollWithCountdown<T>(
  fetcher: () => Promise<T>,
  intervalSec = 60,
) {
  // How many seconds remain until the next global boundary at `intervalSec`.
  const secondsToNextBoundary = () => {
    const phase = Math.floor((Date.now() / 1000) % intervalSec);
    return phase === 0 ? intervalSec : intervalSec - phase;
  };

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const [secondsUntilNext, setSecondsUntilNext] = useState<number>(
    secondsToNextBoundary,
  );
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
        // Reset countdown to the full interval the moment fresh data arrives.
        setSecondsUntilNext(intervalSec);
      } catch {
        if (!alive) return;
        setError(true);
      }
    };

    // Initial fetch on mount.
    run();

    // Schedule subsequent fetches on wall-clock boundaries.
    // Use a recursive setTimeout so each scheduled time lands exactly on the
    // next boundary — independent of how long the previous fetch took.
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      timeoutId = setTimeout(() => {
        run();
        schedule();
      }, intervalSec * 1000);
    };

    // First scheduled refresh lands on the next global boundary.
    const initialDelay = secondsToNextBoundary() * 1000;
    timeoutId = setTimeout(() => {
      run();
      schedule();
    }, initialDelay);

    // Tick the countdown once per second. Runs independently of fetch timing.
    const tick = setInterval(() => {
      setSecondsUntilNext((s) => (s > 1 ? s - 1 : 1));
    }, 1000);

    return () => {
      alive = false;
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(tick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalSec]);

  return { data, error, secondsUntilNext, lastUpdatedAt };
}

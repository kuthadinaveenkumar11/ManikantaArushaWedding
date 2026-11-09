import { useEffect, useState } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

/**
 * Pure calculation between two absolute instants (milliseconds since the epoch).
 * No local-time arithmetic happens here, so the visitor's timezone and daylight
 * saving cannot change the result. Seconds round up, so the display reaches zero
 * exactly at the target rather than a second early.
 */
export function getTimeLeft(targetMs: number, nowMs: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.ceil((targetMs - nowMs) / 1000));
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor(totalSeconds / 3_600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
    isComplete: totalSeconds === 0,
  };
}

/** Ticks on each second boundary and stops for good once the target is reached. */
export function useCountdown(targetIso: string): TimeLeft {
  const targetMs = Date.parse(targetIso);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const isComplete = nowMs >= targetMs;

  useEffect(() => {
    if (isComplete) return;

    let timer: number;
    const tick = () => {
      const current = Date.now();
      setNowMs(current);
      if (current < targetMs) schedule(current);
    };
    // The small margin keeps a timer that fires early from repeating a second.
    const schedule = (from: number) => {
      timer = window.setTimeout(tick, 1000 - (from % 1000) + 10);
    };
    // Browsers throttle hidden tabs, so resync the moment the tab returns.
    const resync = () => {
      if (document.visibilityState === 'visible') setNowMs(Date.now());
    };

    schedule(Date.now());
    document.addEventListener('visibilitychange', resync);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', resync);
    };
  }, [isComplete, targetMs]);

  return getTimeLeft(targetMs, nowMs);
}

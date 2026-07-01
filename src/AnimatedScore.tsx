// ---------------------------------------------------------------------------
// AnimatedScore — counts up to the composite score on first mount
// ---------------------------------------------------------------------------
// Uses requestAnimationFrame with a cubic ease-out for a smooth 1.2 s
// reveal. The score feels earned rather than given.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";

interface Props {
  target: number;
  /** Starting value. Defaults to target - 3 (subtle reveal for scores). */
  from?: number;
  /** Duration in ms. Defaults to 1200. */
  duration?: number;
  /** Decimal places. Defaults to 1. */
  decimals?: number;
  /** CSS class on the wrapping span. */
  className?: string;
  /** If true, skip the animation (prefers-reduced-motion). */
  reduced?: boolean;
}

export default function AnimatedScore({
  target,
  from,
  duration = 1200,
  decimals = 1,
  className,
  reduced,
}: Props) {
  // Default: start 3 below target (subtle reveal for composite scores).
  // For large stats (e.g. 118 cities), pass from={0} for a dramatic count-up.
  const computedStart = from ?? Math.max(0, target - 3);

  const isReducedMotion = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const [displayed, setDisplayed] = useState<number>(() => {
    const prefersReduced = reduced || isReducedMotion();
    return prefersReduced ? target : computedStart;
  });
  const [prevTarget, setPrevTarget] = useState(target);

  if (target !== prevTarget) {
    setPrevTarget(target);
    const prefersReduced = reduced || isReducedMotion();
    setDisplayed(prefersReduced ? target : computedStart);
  }

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = reduced || isReducedMotion();
    if (prefersReduced) return;

    // Cancel any in-flight animation before starting
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // Cubic ease-out: 1 − (1 − t)³
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round((computedStart + eased * (target - computedStart)) * 10 ** decimals) / 10 ** decimals);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, computedStart, duration, decimals, reduced]);

  return (
    <span className={className}>
      {displayed.toFixed(decimals)}
    </span>
  );
}

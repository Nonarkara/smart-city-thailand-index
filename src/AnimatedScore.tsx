// ---------------------------------------------------------------------------
// AnimatedScore — counts up to the composite score on first mount
// ---------------------------------------------------------------------------
// Uses requestAnimationFrame with a cubic ease-out for a smooth 1.2 s
// reveal. The score feels earned rather than given.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";

interface Props {
  target: number;
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
  duration = 1200,
  decimals = 1,
  className,
  reduced,
}: Props) {
  const from = Math.max(0, target - 3);
  const [displayed, setDisplayed] = useState<number>(
    reduced ? target : from,
  );
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion at the system level too
    const prefersReduced =
      reduced ||
      (typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (prefersReduced) {
      setDisplayed(target);
      return;
    }

    // Cancel any in-flight animation before starting
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const startVal = Math.max(0, target - 3);
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // Cubic ease-out: 1 − (1 − t)³
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round((startVal + eased * (target - startVal)) * 10 ** decimals) / 10 ** decimals);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, decimals, reduced]);

  return (
    <span className={className}>
      {displayed.toFixed(decimals)}
    </span>
  );
}

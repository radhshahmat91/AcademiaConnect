import { useEffect, useRef, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

// Animates a number from wherever it currently is up to `target`.
// With reduced motion on, it simply returns the target.
export default function useCountUp(target, { duration = 900, delay = 0 } = {}) {
  const reduced = usePrefersReducedMotion();
  const safeTarget = Number.isFinite(target) ? target : 0;
  const [value, setValue] = useState(reduced ? safeTarget : 0);
  const current = useRef(reduced ? safeTarget : 0);

  useEffect(() => {
    if (reduced) {
      current.current = safeTarget;
      setValue(safeTarget);
      return undefined;
    }

    const from = current.current;
    if (from === safeTarget) return undefined;

    let raf;
    let startedAt = null;
    const timer = setTimeout(() => {
      const tick = (now) => {
        if (startedAt === null) startedAt = now;
        const progress = Math.min((now - startedAt) / duration, 1);
        const next = Math.round(from + (safeTarget - from) * easeOutExpo(progress));
        current.current = next;
        setValue(next);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [safeTarget, duration, delay, reduced]);

  return value;
}

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

// Measures the "active" child of a container so a highlight can slide to it.
// The active child is whichever element has aria-current="page" (NavLink) or data-active="true".
// The container must be `position: relative`.
export default function useSlidingIndicator(containerRef, watch) {
  const [rect, setRect] = useState(null);
  const [animate, setAnimate] = useState(false);

  const measure = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    const el = root.querySelector('[aria-current="page"], [data-active="true"]');
    if (!el) {
      setRect(null);
      return;
    }
    setRect({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });
  }, [containerRef]);

  useLayoutEffect(() => {
    measure();
  }, [measure, watch]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(root);
    document.fonts?.ready?.then(measure);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef, measure]);

  // Don't animate the very first placement, only later moves.
  const placed = !!rect;
  useEffect(() => {
    if (!placed) return undefined;
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [placed]);

  return { rect, animate };
}

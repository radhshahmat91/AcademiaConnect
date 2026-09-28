import { useEffect } from 'react';

// One delegated listener: any element with the `.spotlight` class gets --mx / --my
// set to the pointer position, which its CSS uses to place a soft glow.
export default function useSpotlight() {
  useEffect(() => {
    let raf = 0;
    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      const el = e.target instanceof Element ? e.target.closest('.spotlight') : null;
      if (!el) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - box.left}px`);
        el.style.setProperty('--my', `${e.clientY - box.top}px`);
      });
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
}

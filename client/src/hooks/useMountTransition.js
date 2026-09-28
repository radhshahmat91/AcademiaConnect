import { useEffect, useState } from 'react';

// Keeps a component mounted for `duration` ms after `open` turns false,
// so an exit animation can play before it disappears.
export default function useMountTransition(open, duration = 200) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    const timer = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);

  return { mounted: open || mounted, closing: !open && mounted };
}

import { useEffect, useRef } from 'react';

const isTyping = (el) =>
  !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);

// useHotkey('k', fn, { mod: true })  -> Ctrl/Cmd + K
// useHotkey('/', fn)                  -> "/" (ignored while typing in a field)
export default function useHotkey(key, handler, { mod = false, allowWhileTyping = false, enabled = true } = {}) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return undefined;
    const onKeyDown = (e) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      const modPressed = e.metaKey || e.ctrlKey;
      if (mod !== modPressed) return;
      if (!mod && e.altKey) return;
      if (!allowWhileTyping && isTyping(e.target)) return;
      e.preventDefault();
      handlerRef.current(e);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [key, mod, allowWhileTyping, enabled]);
}

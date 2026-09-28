// Label for the platform's command key, used in shortcut hints.
export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.userAgent);
export const modKey = isMac ? '⌘' : 'Ctrl';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import useMountTransition from '../../hooks/useMountTransition';

export default function Modal({ open, onClose, title, children, wide = false }) {
  // Stay mounted a beat after close so the panel can ease out instead of vanishing.
  const { mounted, closing } = useMountTransition(open, 200);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-ink/40 px-4 py-10 ${
        closing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      onClick={onClose}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-md border border-hairline bg-paper shadow-elevated ${
          closing ? 'animate-scale-out' : 'animate-scale-in'
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h3 className="font-display text-lg font-semibold text-forest-ink">{title}</h3>
          <button onClick={onClose} className="icon-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

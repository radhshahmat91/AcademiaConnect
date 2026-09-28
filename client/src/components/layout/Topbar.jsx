import { Menu } from 'lucide-react';

// Mobile-only bar with the hamburger to open the sidebar drawer.
// Desktop relies on the always-visible Sidebar, so this stays hidden at lg+.
export default function Topbar({ onOpenMobile }) {
  return (
    <div className="flex items-center gap-3 border-b border-hairline bg-paper px-4 py-3 lg:hidden">
      <button
        onClick={onOpenMobile}
        className="rounded p-1.5 text-forest-ink transition duration-150 hover:bg-forest-ink/5 active:scale-90"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 64 64" className="h-6 w-6 shrink-0">
          <path d="M32 4 L58 14 V30 C58 46 47 57 32 61 C17 57 6 46 6 30 V14 Z" fill="#14302A" />
          <path d="M32 19 L32 46 M20 27 L44 27 M22 36 L42 36" stroke="#BF9A3A" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
        <span className="font-display text-base font-semibold text-forest-ink">AcademiaConnect</span>
      </div>
    </div>
  );
}

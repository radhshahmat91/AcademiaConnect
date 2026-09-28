import Seal from './Seal';

export default function AuthBrandPanel({ headline, subcopy }) {
  return (
    <div className="hero-surface auth-hero relative hidden flex-col justify-between overflow-hidden p-12 text-parchment lg:flex">
      <video
        className="auth-video-backdrop"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/videos/academiaconnect-auth.mp4" type="video/mp4" />
      </video>
      <div className="auth-video-overlay" aria-hidden="true" />
      <div className="ledger-lines absolute inset-0" aria-hidden="true" />

      <div className="relative flex items-center gap-3">
        <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0">
          <path d="M32 4 L58 14 V30 C58 46 47 57 32 61 C17 57 6 46 6 30 V14 Z" fill="#F3EEE0" />
          <path
            className="logo-draw"
            d="M32 19 L32 46 M20 27 L44 27 M22 36 L42 36"
            fill="none"
            stroke="#BF9A3A"
            strokeWidth="3.4"
            strokeLinecap="round"
            pathLength="1"
          />
        </svg>
        <span className="font-display text-xl font-semibold">AcademiaConnect</span>
      </div>

      <div className="relative max-w-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-crest-light/20 bg-paper/5 px-3 py-1.5 text-xs font-medium tracking-wide text-crest-light backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-crest-light" />
          UNIVERSITY DIGITAL HUB
        </div>
        <Seal className="mb-7 h-28 w-28" />
        <p className="font-display text-4xl font-semibold leading-[1.08] sm:text-5xl">{headline}</p>
        <p className="mt-5 max-w-lg text-base leading-7 text-parchment/70">{subcopy}</p>
      </div>

      <p className="relative text-xs text-parchment/40">&copy; {new Date().getFullYear()} AcademiaConnect</p>
    </div>
  );
}

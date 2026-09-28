export default function LoadingSpinner({ label = 'Loading...', fullPage = false }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3 text-ink-muted">
      <svg viewBox="0 0 66 66" className="h-9 w-9">
        <circle cx="33" cy="33" r="30" fill="none" strokeWidth="3.5" stroke="currentColor" className="text-hairline" />
        <circle
          cx="33"
          cy="33"
          r="30"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          stroke="currentColor"
          className="loader-trace text-crest"
          transform="rotate(-90 33 33)"
        />
      </svg>
      <span className="text-sm">{label}</span>
    </div>
  );

  if (fullPage) {
    return <div className="flex min-h-[60vh] items-center justify-center">{spinner}</div>;
  }
  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}

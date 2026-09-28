import { useId } from 'react';

/**
 * The registrar's seal — a one-time "stamped" flourish for the auth branded
 * panels. All motion is driven by the seal-* classes in index.css: the ring
 * draws in, the motto turns into place, the shield stamps down, and an ink
 * ring ripples outward. Plays once on mount; respects reduced-motion.
 */
export default function Seal({ className = '' }) {
  const pathId = useId();

  const dots = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const r = 45;
    return { cx: 60 + r * Math.cos(angle), cy: 60 + r * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <path id={pathId} d="M 60,60 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
      </defs>
      <g className="seal-animated">
        <circle className="seal-outer" cx="60" cy="60" r="52" fill="none" stroke="#BF9A3A" strokeWidth="1.25" pathLength="1" />
        <g className="seal-dots" fill="#BF9A3A">
          {dots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r="1.5" />
          ))}
        </g>
        <text className="seal-text" fill="#BF9A3A" fontSize="7.5" letterSpacing="2.5" fontFamily="'Zilla Slab', serif">
          <textPath href={`#${pathId}`} startOffset="1%">
            ACADEMIACONNECT • EST. 2024 •
          </textPath>
        </text>
        <circle className="seal-pulse" cx="60" cy="60" r="40" fill="none" stroke="#BF9A3A" strokeWidth="1.5" />
        <g className="seal-shield">
          <path
            d="M60 33 L83.5 43 V60 C83.5 76.5 72 87 60 91 C48 87 36.5 76.5 36.5 60 V43 Z"
            fill="#F3EEE0"
            stroke="#BF9A3A"
            strokeWidth="1.25"
          />
          <path
            d="M60 47 L60 75 M49.5 56 L70.5 56 M51.5 65.5 L68.5 65.5"
            fill="none"
            stroke="#BF9A3A"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}

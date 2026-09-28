import {
  BookOpen,
  GraduationCap,
  Laptop,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

const FLOATERS = [
  { Icon: GraduationCap, className: 'motion-float motion-float-a' },
  { Icon: BookOpen, className: 'motion-float motion-float-b' },
  { Icon: Laptop, className: 'motion-float motion-float-c' },
  { Icon: MessageCircle, className: 'motion-float motion-float-d' },
];

export default function AnimatedCampusBackdrop({ dark = false, compact = false }) {
  return (
    <div
      aria-hidden="true"
      className={`animated-campus-backdrop ${dark ? 'is-dark' : ''} ${compact ? 'is-compact' : ''}`}
    >
      <div className="motion-orb motion-orb-one" />
      <div className="motion-orb motion-orb-two" />
      <div className="motion-orb motion-orb-three" />

      <svg className="motion-grid" viewBox="0 0 900 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="campusLine" x1="0" x2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.5" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[80, 160, 240, 320, 400, 480, 560].map((y) => (
          <path key={y} d={`M0 ${y} C180 ${y - 55}, 320 ${y + 55}, 450 ${y} S720 ${y - 55}, 900 ${y}`} fill="none" stroke="url(#campusLine)" />
        ))}
      </svg>

      {FLOATERS.map(({ Icon, className }, index) => (
        <div key={className} className={`motion-floater ${className}`}>
          <Icon size={compact ? 18 : 22} strokeWidth={1.5} />
          {index === 0 && <Sparkles size={10} className="absolute -right-1 -top-1 motion-spark" />}
        </div>
      ))}

      <div className="motion-scanline" />
    </div>
  );
}

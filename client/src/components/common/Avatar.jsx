import { fileUrl } from '../../services/api';

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
};

export default function Avatar({ src, name, size = 'md', className = '' }) {
  const sizeClass = SIZES[size] || SIZES.md;

  if (src) {
    return (
      <img
        src={fileUrl(src)}
        alt={name || 'User avatar'}
        className={`${sizeClass} rounded-full object-cover border border-hairline ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${className} flex items-center justify-center rounded-full bg-forest-ink font-display font-medium text-parchment border border-hairline`}
      aria-label={name}
    >
      {initials(name) || '?'}
    </div>
  );
}

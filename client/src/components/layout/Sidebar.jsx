import { useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarDays,
  Bell,
  MessageSquare,
  UserRound,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import useSlidingIndicator from '../../hooks/useSlidingIndicator';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/clubs', label: 'Clubs', icon: Users },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/notices', label: 'Notices', icon: Bell },
  { to: '/messages', label: 'Messaging', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export default function Sidebar({ onNavigate, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navRef = useRef(null);
  const { pathname } = useLocation();
  const { rect: activeRect, animate: indicatorAnimate } = useSlidingIndicator(navRef, pathname);

  const linkClasses = ({ isActive }) =>
    `relative z-10 flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors duration-200 ${
      isActive
        ? 'text-crest-light font-medium'
        : 'text-parchment/75 hover:bg-paper/5 hover:text-parchment'
    }`;

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-forest-ink/50 lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-forest-ink transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0">
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
            <span className="font-display text-lg font-semibold text-parchment">AcademiaConnect</span>
          </div>
          <button onClick={onCloseMobile} className="text-parchment/70 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav ref={navRef} className="relative flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {activeRect && (
            <span
              aria-hidden="true"
              className={`absolute rounded bg-crest/15 ${indicatorAnimate ? 'transition-all duration-300 ease-out-expo' : ''}`}
              style={{ top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
            />
          )}
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClasses} onClick={onNavigate}>
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <div className="my-3 border-t border-parchment/10" />
              <NavLink to="/admin" className={linkClasses} onClick={onNavigate}>
                <ShieldCheck size={18} strokeWidth={1.75} />
                Admin Panel
              </NavLink>
            </>
          )}
        </nav>

        <div className="border-t border-parchment/10 px-3 py-4">
          <div className="flex items-center gap-2.5 rounded px-2 py-1.5">
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-parchment">{user?.name}</p>
              <p className="truncate text-xs text-parchment/50">{user?.department || user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="rounded p-1.5 text-parchment/60 hover:bg-paper/10 hover:text-parchment"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

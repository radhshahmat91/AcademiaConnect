import { useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import useSlidingIndicator from '../../hooks/useSlidingIndicator';

const TABS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/clubs', label: 'Clubs' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/notices', label: 'Notices' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminLayout() {
  const tabRef = useRef(null);
  const { pathname } = useLocation();
  const { rect, animate } = useSlidingIndicator(tabRef, pathname);

  return (
    <div>
      <div>
        <span className="badge-gold">Admin site</span>
        <h1 className="mt-2 page-heading">Administration</h1>
        <div className="ledger-rule my-3" />
        <p className="text-sm text-ink-muted">Manage everything students see across AcademiaConnect.</p>
      </div>

      <div ref={tabRef} className="relative mt-5 flex gap-1 overflow-x-auto border-b border-hairline">
        {rect && (
          <span
            aria-hidden="true"
            className={`absolute bottom-0 h-0.5 bg-crest ${animate ? 'transition-all duration-300 ease-out-expo' : ''}`}
            style={{ left: rect.left, width: rect.width }}
          />
        )}
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `shrink-0 px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive ? 'text-forest-ink' : 'text-ink-muted hover:text-ink'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="pt-6">
        <Outlet />
      </div>
    </div>
  );
}

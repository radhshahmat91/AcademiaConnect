import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-parchment">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onNavigate={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {/* Keyed by route so each page eases in fresh instead of popping in place. */}
          <div key={pathname} className="mx-auto max-w-6xl animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

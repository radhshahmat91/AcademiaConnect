import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users as UsersIcon } from 'lucide-react';
import { format } from 'date-fns';
import api, { fileUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NoticeCard from '../components/cards/NoticeCard';
import EventCard from '../components/cards/EventCard';
import EmptyState from '../components/common/EmptyState';
import AnimatedCampusBackdrop from '../components/common/AnimatedCampusBackdrop';

export default function Dashboard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/notices'), api.get('/events?upcoming=true')])
      .then(([n, e]) => {
        setNotices(n.data.slice(0, 3));
        setEvents(e.data.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero spotlight overflow-hidden">
        <AnimatedCampusBackdrop />
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-crest/25 bg-paper/60 px-3 py-1.5 text-xs font-medium text-crest-deep backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-crest" />
            YOUR CAMPUS, CONNECTED
          </div>
          <h1 className="page-heading">Welcome back, {firstName}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">Here's what's on record for you today. Keep up with campus notices, events, courses, and your communities.</p>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="reveal" style={{ "--i": 1 }}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-forest-ink">Notices</h2>
                <Link to="/notices" className="flex items-center gap-1 text-sm text-forest hover:underline">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              {notices.length === 0 ? (
                <EmptyState title="No notices yet" description="Announcements from the administration will show up here." />
              ) : (
                <div className="space-y-3">
                  {notices.map((n) => <NoticeCard key={n._id} notice={n} />)}
                </div>
              )}
            </section>

            <section className="reveal" style={{ "--i": 2 }}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-forest-ink">Upcoming events</h2>
                <Link to="/events" className="flex items-center gap-1 text-sm text-forest hover:underline">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              {events.length === 0 ? (
                <EmptyState title="Nothing scheduled" description="Upcoming events from clubs and the university will appear here." />
              ) : (
                <div className="space-y-3">
                  {events.map((e) => <EventCard key={e._id} event={e} />)}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section className="card card-hover spotlight reveal" style={{ "--i": 3 }}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-base font-semibold text-forest-ink">
                  <BookOpen size={16} /> Your courses
                </h2>
                <Link to="/courses" className="text-xs text-forest hover:underline">Browse</Link>
              </div>
              {user?.enrolledCourses?.length ? (
                <ul className="space-y-2.5">
                  {user.enrolledCourses.map((c) => (
                    <li key={c._id}>
                      <Link to={`/courses/${c._id}`} className="flex items-center gap-2.5 text-sm text-ink hover:text-forest">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-crest" />
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">You haven't enrolled in any courses yet.</p>
              )}
            </section>

            <section className="card card-hover spotlight reveal" style={{ "--i": 4 }}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-base font-semibold text-forest-ink">
                  <UsersIcon size={16} /> Your clubs
                </h2>
                <Link to="/clubs" className="text-xs text-forest hover:underline">Browse</Link>
              </div>
              {user?.joinedClubs?.length ? (
                <ul className="space-y-2.5">
                  {user.joinedClubs.map((c) => (
                    <li key={c._id}>
                      <Link to={`/clubs/${c._id}`} className="flex items-center gap-2.5 text-sm text-ink hover:text-forest">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-crest" />
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">You haven't joined any clubs yet.</p>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

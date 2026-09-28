import { useEffect, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import api from '../../services/api';
import EventCard from '../../components/cards/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import usePageTitle from '../../hooks/usePageTitle';
import useSlidingIndicator from '../../hooks/useSlidingIndicator';

export default function Events() {
  usePageTitle('Events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const tabRef = useRef(null);
  const { rect: tabRect, animate: tabAnimate } = useSlidingIndicator(tabRef, filter);

  useEffect(() => {
    setLoading(true);
    api
      .get('/events', { params: filter === 'upcoming' ? { upcoming: 'true' } : {} })
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <h1 className="page-heading">Events</h1>
      <div className="ledger-rule my-3" />
      <p className="text-sm text-ink-muted">Campus events and club activities.</p>

      <div ref={tabRef} className="relative mt-6 inline-flex rounded border border-hairline bg-paper p-1">
        {tabRect && (
          <span
            aria-hidden="true"
            className={`absolute rounded bg-forest ${tabAnimate ? 'transition-all duration-300 ease-out-expo' : ''}`}
            style={{ top: tabRect.top, left: tabRect.left, width: tabRect.width, height: tabRect.height }}
          />
        )}
        {[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'all', label: 'All events' },
        ].map((tab) => (
          <button
            key={tab.key}
            data-active={filter === tab.key ? 'true' : undefined}
            onClick={() => setFilter(tab.key)}
            className={`relative z-10 rounded px-3.5 py-1.5 text-sm transition-colors duration-200 ${
              filter === tab.key ? 'text-paper' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No events found" description="Check back later, or view all events instead of only upcoming ones." />
        ) : (
          <div className="space-y-3">
            {events.map((event, i) => <EventCard key={event._id} event={event} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import api, { fileUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import usePageTitle from '../../hooks/usePageTitle';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [bursting, setBursting] = useState(false);
  usePageTitle(event?.title || 'Event');

  const load = () => api.get(`/events/${id}`).then((res) => setEvent(res.data));

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !event) return <LoadingSpinner fullPage />;

  const isAttending = event.attendees?.some((a) => a._id === user._id);
  const date = new Date(event.date);

  const handleAttend = async () => {
    setUpdating(true);
    const wasAttending = isAttending;
    await api.post(`/events/${id}/attend`);
    await load();
    setUpdating(false);
    if (!wasAttending) {
      setBursting(true);
      setTimeout(() => setBursting(false), 800);
    }
  };

  return (
    <div>
      <Link to="/events" className="back-link">
        <ArrowLeft size={15} /> Back to events
      </Link>

      <div className="card overflow-hidden">
        {event.image && <img src={fileUrl(event.image)} alt="" className="h-56 w-full object-cover" />}
        <div className="p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              {event.club?.name && <span className="badge-gold">{event.club.name}</span>}
              <h1 className="mt-2 font-display text-2xl font-semibold text-forest-ink">{event.title}</h1>
              <p className="mt-1 text-sm text-ink-muted">Organized by {event.organizer || 'the university'}</p>
            </div>
            <div className="relative inline-block shrink-0">
              <button
                onClick={handleAttend}
                disabled={updating}
                className={`toggle-btn ${isAttending ? 'btn-secondary is-active' : 'btn-primary'}`}
              >
                {isAttending ? (
                  <span className="label-swap">
                    <span className="label-default">You're attending</span>
                    <span className="label-hover">Cancel</span>
                  </span>
                ) : (
                  'Attend event'
                )}
              </button>
              {bursting && (
                <span className="burst" aria-hidden="true">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <i key={i} style={{ '--a': `${i * 36}deg`, '--d': `${18 + (i % 3) * 6}px`, animationDelay: `${i * 12}ms` }} />
                  ))}
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-y border-hairline py-4 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5"><Clock size={15} /> {format(date, 'EEEE, MMM d, yyyy')}{event.time ? ` · ${event.time}` : ''}</span>
            {event.location && <span className="flex items-center gap-1.5"><MapPin size={15} /> {event.location}</span>}
            <span className="flex items-center gap-1.5"><Users size={15} /> {event.attendees?.length ?? 0} attending</span>
          </div>

          {event.description && <p className="mt-5 max-w-prose text-sm leading-relaxed text-ink">{event.description}</p>}

          {event.attendees?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2.5 text-sm font-medium text-forest-ink">Who's going</p>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((a, i) => (
                  <div
                    key={a._id}
                    className="reveal flex items-center gap-2 rounded border border-hairline bg-parchment/60 py-1 pl-1 pr-3 text-sm"
                    style={{ '--i': i }}
                  >
                    <Avatar src={a.avatar} name={a.name} size="sm" />
                    {a.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

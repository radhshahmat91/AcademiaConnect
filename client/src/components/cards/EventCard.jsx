import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function EventCard({ event, index = 0 }) {
  const date = new Date(event.date);
  const isPast = date < new Date();

  return (
    <Link
      to={`/events/${event._id}`}
      className="group card card-hover spotlight reveal flex gap-4 p-4"
      style={{ '--i': index }}
    >
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded border border-hairline bg-forest-ink transition duration-300 ease-out-expo group-hover:scale-[1.04]">
        <span className="font-display text-xl font-semibold leading-none text-crest-light">{format(date, 'd')}</span>
        <span className="mt-1 text-[11px] uppercase tracking-wide text-parchment/70">{format(date, 'MMM')}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-forest-ink">
            <span className="link-draw">{event.title}</span>
          </h3>
          {isPast && <span className="badge bg-ink/5 text-ink-muted">Past</span>}
        </div>
        {event.club?.name && <p className="text-xs text-ink-muted">Hosted by {event.club.name}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
          {event.time && <span>{event.time}</span>}
          {event.location && (
            <span className="flex items-center gap-1"><MapPin size={13} /> {event.location}</span>
          )}
          <span className="flex items-center gap-1"><Users size={13} /> {event.attendees?.length ?? 0} attending</span>
        </div>
      </div>
    </Link>
  );
}

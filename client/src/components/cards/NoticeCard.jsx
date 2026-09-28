import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function NoticeCard({ notice, index = 0 }) {
  return (
    <Link
      to={`/notices/${notice._id}`}
      className={`group card card-hover spotlight reveal block p-4 ${notice.important ? 'border-crest/50' : ''}`}
      style={{ '--i': index }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <span className={notice.important ? 'badge-gold' : 'badge-forest'}>{notice.category}</span>
            {notice.important && <span className="text-xs font-medium text-crest-deep">Important</span>}
          </div>
          <h3 className="font-display text-base font-semibold leading-snug text-forest-ink">
            <span className="link-draw">{notice.title}</span>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{notice.content}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        {notice.postedBy?.name || 'Administration'} &middot; {format(new Date(notice.createdAt), 'MMM d, yyyy')}
      </p>
    </Link>
  );
}

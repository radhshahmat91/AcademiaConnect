import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePageTitle from '../../hooks/usePageTitle';

export default function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  usePageTitle(notice?.title || 'Notice');

  useEffect(() => {
    api.get(`/notices/${id}`).then((res) => setNotice(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading || !notice) return <LoadingSpinner fullPage />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/notices" className="back-link">
        <ArrowLeft size={15} /> Back to notices
      </Link>

      <div className={`card reveal p-6 ${notice.important ? 'border-crest/50' : ''}`}>
        <div className="mb-2 flex items-center gap-2">
          <span className={notice.important ? 'badge-gold' : 'badge-forest'}>{notice.category}</span>
          {notice.important && <span className="text-xs font-medium text-crest-deep">Important</span>}
        </div>
        <h1 className="font-display text-2xl font-semibold text-forest-ink">{notice.title}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Posted by {notice.postedBy?.name || 'Administration'} on {format(new Date(notice.createdAt), 'MMMM d, yyyy')}
        </p>
        <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-ink">{notice.content}</p>
      </div>
    </div>
  );
}

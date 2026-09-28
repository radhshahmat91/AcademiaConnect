import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import NoticeCard from '../components/cards/NoticeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import usePageTitle from '../hooks/usePageTitle';

const CATEGORIES = ['All', 'Academic', 'Exam', 'Event', 'Holiday', 'General', 'Urgent'];

export default function Notices() {
  usePageTitle('Notices');
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    api
      .get('/notices', { params: category !== 'All' ? { category } : {} })
      .then((res) => setNotices(res.data))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="page-heading">Notices</h1>
        {user.role === 'admin' && (
          <Link to="/admin/notices" className="btn-secondary shrink-0">
            <Settings size={15} /> Manage notices
          </Link>
        )}
      </div>
      <div className="ledger-rule my-3" />
      <p className="text-sm text-ink-muted">Official announcements from the university.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner />
        ) : notices.length === 0 ? (
          <EmptyState icon={Bell} title="No notices in this category" />
        ) : (
          <div className="space-y-3">
            {notices.map((n, i) => <NoticeCard key={n._id} notice={n} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

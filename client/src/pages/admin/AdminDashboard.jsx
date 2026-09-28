import { useEffect, useState } from 'react';
import { Users, BookOpen, UsersRound, CalendarDays, Bell, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePageTitle from '../../hooks/usePageTitle';
import useCountUp from '../../hooks/useCountUp';

const STAT_CARDS = [
  { key: 'userCount', label: 'Total users', icon: Users },
  { key: 'studentCount', label: 'Students', icon: UsersRound },
  { key: 'courseCount', label: 'Courses', icon: BookOpen },
  { key: 'clubCount', label: 'Clubs', icon: UsersRound },
  { key: 'eventCount', label: 'Total events', icon: CalendarDays },
  { key: 'upcomingEventCount', label: 'Upcoming events', icon: CalendarCheck },
  { key: 'noticeCount', label: 'Notices posted', icon: Bell },
];

function StatCard({ icon: Icon, label, value, index }) {
  const count = useCountUp(value, { duration: 900, delay: index * 60 });
  return (
    <div className="card card-hover reveal p-4" style={{ '--i': index }}>
      <Icon size={18} className="text-forest" />
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-forest-ink">{count}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  usePageTitle('Admin overview');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon }, i) => (
          <StatCard key={key} icon={Icon} label={label} value={stats[key]} index={i} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold text-forest-ink">Recently posted notices</h2>
        <div className="divide-y divide-hairline rounded-md border border-hairline bg-paper">
          {stats.recentNotices.map((n, i) => (
            <div key={n._id} className="reveal flex items-center justify-between gap-3 px-4 py-3" style={{ '--i': i }}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{n.title}</p>
                <p className="text-xs text-ink-muted">{n.postedBy?.name} &middot; {format(new Date(n.createdAt), 'MMM d, yyyy')}</p>
              </div>
              {n.important && <span className="badge-gold shrink-0">Important</span>}
            </div>
          ))}
          {stats.recentNotices.length === 0 && <p className="p-4 text-sm text-ink-muted">No notices posted yet.</p>}
        </div>
      </div>
    </div>
  );
}

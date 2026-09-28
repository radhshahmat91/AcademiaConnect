import { useEffect, useState } from 'react';
import { Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/common/Avatar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePageTitle from '../../hooks/usePageTitle';

export default function ManageUsers() {
  usePageTitle('Admin · Users');
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => api.get('/admin/users').then((res) => setUsers(res.data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const toggleRole = async (u) => {
    const role = u.role === 'admin' ? 'student' : 'admin';
    await api.put(`/admin/users/${u._id}/role`, { role });
    load();
  };

  const handleDelete = async () => {
    await api.delete(`/admin/users/${deleteTarget._id}`);
    load();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Department</th>
              <th>Role</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className="reveal" style={{ '--i': i }}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <Avatar src={u.avatar} name={u.name} size="sm" />
                    <div>
                      <p className="font-medium text-ink">{u.name}</p>
                      <p className="text-xs text-ink-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="text-ink-muted">{u.department || '—'}</td>
                <td>
                  <span className={u.role === 'admin' ? 'badge-gold' : 'badge-forest'}>{u.role}</span>
                </td>
                <td className="text-ink-muted">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                <td>
                  {u._id !== me._id && (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleRole(u)}
                        title={u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                        className="icon-btn"
                      >
                        {u.role === 'admin' ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                      </button>
                      <button onClick={() => setDeleteTarget(u)} title="Delete user" className="icon-btn icon-btn-danger">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                  {u._id === me._id && <span className="block text-right text-xs text-ink-muted">You</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this user?"
        description={`"${deleteTarget?.name}" will be permanently removed, along with their enrollments and club memberships.`}
      />
    </div>
  );
}

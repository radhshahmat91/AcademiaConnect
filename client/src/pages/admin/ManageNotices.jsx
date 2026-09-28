import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePageTitle from '../../hooks/usePageTitle';

const CATEGORIES = ['Academic', 'Exam', 'Event', 'Holiday', 'General', 'Urgent'];
const emptyForm = { title: '', content: '', category: 'General', important: false };

export default function ManageNotices() {
  usePageTitle('Admin · Notices');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => api.get('/notices').then((res) => setNotices(res.data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (notice) => {
    setEditing(notice);
    setForm({ title: notice.title, content: notice.content, category: notice.category, important: notice.important });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/notices/${editing._id}`, form);
      else await api.post('/notices', form);
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await api.delete(`/notices/${deleteTarget._id}`);
    load();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New notice</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Posted</th>
              <th>Important</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n, i) => (
              <tr key={n._id} className="reveal" style={{ '--i': i }}>
                <td className="font-medium text-ink">{n.title}</td>
                <td className="text-ink-muted">{n.category}</td>
                <td className="text-ink-muted">{format(new Date(n.createdAt), 'MMM d, yyyy')}</td>
                <td>{n.important && <span className="badge-gold">Important</span>}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(n)} title="Edit" className="icon-btn">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget(n)} title="Delete" className="icon-btn icon-btn-danger">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink-muted">No notices yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit notice' : 'New notice'} wide>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Content</label>
            <textarea required className="input-field min-h-[120px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="flex items-end gap-6">
            <div className="flex-1">
              <label className="field-label">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 pb-2.5 text-sm text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-hairline accent-forest"
                checked={form.important}
                onChange={(e) => setForm({ ...form, important: e.target.checked })}
              />
              Mark as important
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{editing ? 'Save changes' : 'Post notice'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this notice?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
      />
    </div>
  );
}

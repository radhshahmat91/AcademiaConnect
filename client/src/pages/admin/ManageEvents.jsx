import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FileUpload from '../../components/upload/FileUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePageTitle from '../../hooks/usePageTitle';

const emptyForm = { title: '', description: '', club: '', date: '', time: '', location: '', organizer: '', image: '' };

export default function ManageEvents() {
  usePageTitle('Admin · Events');
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => api.get('/events').then((res) => setEvents(res.data));

  useEffect(() => {
    Promise.all([load(), api.get('/clubs').then((res) => setClubs(res.data))]).finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      title: event.title, description: event.description || '', club: event.club?._id || '',
      date: format(new Date(event.date), 'yyyy-MM-dd'), time: event.time || '',
      location: event.location || '', organizer: event.organizer || '', image: event.image || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, club: form.club || null };
      if (editing) await api.put(`/events/${editing._id}`, payload);
      else await api.post('/events', payload);
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await api.delete(`/events/${deleteTarget._id}`);
    load();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New event</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Club</th>
              <th>Attendees</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={e._id} className="reveal" style={{ '--i': i }}>
                <td className="font-medium text-ink">{e.title}</td>
                <td className="text-ink-muted">{format(new Date(e.date), 'MMM d, yyyy')}</td>
                <td className="text-ink-muted">{e.club?.name || '—'}</td>
                <td className="text-ink-muted">{e.attendees?.length ?? 0}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(e)} title="Edit" className="icon-btn">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget(e)} title="Delete" className="icon-btn icon-btn-danger">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink-muted">No events yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit event' : 'New event'} wide>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="input-field min-h-[70px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="field-label">Date</label>
              <input required type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Time</label>
              <input className="input-field" placeholder="e.g. 4:00 PM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Hosting club (optional)</label>
              <select className="input-field" value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })}>
                <option value="">None — university-wide event</option>
                {clubs.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Organizer</label>
              <input className="input-field" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
            </div>
          </div>
          <FileUpload label="Event image" kind="image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{editing ? 'Save changes' : 'Create event'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this event?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
      />
    </div>
  );
}

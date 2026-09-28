import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FileUpload from '../../components/upload/FileUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePageTitle from '../../hooks/usePageTitle';

const emptyForm = { name: '', category: 'Technical', description: '', logo: '', coverImage: '' };

export default function ManageClubs() {
  usePageTitle('Admin · Clubs');
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => api.get('/clubs').then((res) => setClubs(res.data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (club) => {
    setEditing(club);
    setForm({
      name: club.name, category: club.category || 'Technical',
      description: club.description || '', logo: club.logo || '', coverImage: club.coverImage || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/clubs/${editing._id}`, form);
      else await api.post('/clubs', form);
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await api.delete(`/clubs/${deleteTarget._id}`);
    load();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New club</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Members</th>
              <th>Updates posted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((c, i) => (
              <tr key={c._id} className="reveal" style={{ '--i': i }}>
                <td className="font-medium text-ink">{c.name}</td>
                <td className="text-ink-muted">{c.category}</td>
                <td className="text-ink-muted">{c.members?.length ?? 0}</td>
                <td className="text-ink-muted">{c.updates?.length ?? 0}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/clubs/${c._id}`} title="View / post update" className="icon-btn">
                      <ExternalLink size={15} />
                    </Link>
                    <button onClick={() => openEdit(c)} title="Edit" className="icon-btn">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget(c)} title="Delete" className="icon-btn icon-btn-danger">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {clubs.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink-muted">No clubs yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit club' : 'New club'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="field-label">Club name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Category</label>
            <input className="input-field" placeholder="e.g. Technical, Cultural" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="input-field min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <FileUpload label="Logo" kind="image" value={form.logo} onChange={(url) => setForm({ ...form, logo: url })} />
          <FileUpload label="Cover image" kind="image" value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{editing ? 'Save changes' : 'Create club'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this club?"
        description={`"${deleteTarget?.name}" and all of its posted updates will be permanently removed.`}
      />
    </div>
  );
}

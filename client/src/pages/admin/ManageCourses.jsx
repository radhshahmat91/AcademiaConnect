import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FileUpload from '../../components/upload/FileUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import usePageTitle from '../../hooks/usePageTitle';

const CATEGORIES = [
  'Data Structures', 'Algorithms', 'Artificial Intelligence', 'Theory of Computation',
  'Database Systems', 'Computer Networks', 'Operating Systems', 'Web Development',
  'Software Engineering', 'Other',
];

const emptyForm = { title: '', code: '', category: CATEGORIES[0], description: '', instructor: '', thumbnail: '' };

export default function ManageCourses() {
  usePageTitle('Admin · Courses');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => api.get('/courses').then((res) => setCourses(res.data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      title: course.title, code: course.code || '', category: course.category,
      description: course.description || '', instructor: course.instructor || '', thumbnail: course.thumbnail || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/courses/${editing._id}`, form);
      else await api.post('/courses', form);
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await api.delete(`/courses/${deleteTarget._id}`);
    load();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> New course</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Videos</th>
              <th>Notes</th>
              <th>Enrolled</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={c._id} className="reveal" style={{ '--i': i }}>
                <td>
                  <p className="font-medium text-ink">{c.title}</p>
                  <p className="text-xs text-ink-muted">{c.code}</p>
                </td>
                <td className="text-ink-muted">{c.category}</td>
                <td className="text-ink-muted">{c.videos?.length ?? 0}</td>
                <td className="text-ink-muted">{c.notes?.length ?? 0}</td>
                <td className="text-ink-muted">{c.enrolledStudents?.length ?? 0}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/courses/${c._id}`} title="View / manage videos & notes" className="icon-btn">
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
            {courses.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-muted">No courses yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit course' : 'New course'} wide>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Title</label>
              <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Course code</label>
              <input className="input-field" placeholder="e.g. CSE 2102" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Instructor</label>
              <input className="input-field" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="input-field min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <FileUpload label="Thumbnail" kind="image" value={form.thumbnail} onChange={(url) => setForm({ ...form, thumbnail: url })} />

          <p className="text-xs text-ink-muted">Videos and notes are added from the course's own page after it's created.</p>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{editing ? 'Save changes' : 'Create course'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this course?"
        description={`"${deleteTarget?.title}" will be permanently removed, including its videos and notes.`}
      />
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Check, KeyRound } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import FileUpload from '../components/upload/FileUpload';
import usePageTitle from '../hooks/usePageTitle';

export default function Profile() {
  usePageTitle('Your profile');
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    department: user.department || '',
    batch: user.batch || '',
    studentId: user.studentId || '',
    avatar: user.avatar || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await api.put('/users/me', form);
      updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwMessage('');
    setPwSaving(true);
    try {
      await api.put('/users/me/password', pwForm);
      setPwMessage('Password updated.');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Could not update password.');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="page-heading">Your profile</h1>
      <div className="ledger-rule my-3" />
      <p className="text-sm text-ink-muted">This is what other students see about you.</p>

      <form onSubmit={handleSave} className="card mt-6 space-y-5 p-6">
        <div className="flex items-center gap-4">
          <Avatar src={form.avatar} name={form.name} size="xl" />
          <FileUpload kind="image" value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Full name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input className="input-field bg-parchment/60" value={user.email} disabled />
          </div>
          <div>
            <label className="field-label">Student ID</label>
            <input className="input-field" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Batch</label>
            <input className="input-field" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Department</label>
            <input className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Bio</label>
            <textarea
              className="input-field min-h-[80px]"
              maxLength={300}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save changes
          </button>
          {saved && (
            <span className="animate-pop flex items-center gap-1 text-sm text-forest-light">
              <Check size={15} /> Saved
            </span>
          )}
        </div>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <p className="font-display text-base font-semibold text-forest-ink">Enrolled courses</p>
          {user.enrolledCourses?.length ? (
            <ul className="mt-2 space-y-1.5 text-sm">
              {user.enrolledCourses.map((c, i) => (
                <li key={c._id} className="reveal" style={{ '--i': i }}>
                  <Link to={`/courses/${c._id}`} className="group text-ink hover:text-forest">
                    <span className="link-draw">{c.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">None yet.</p>
          )}
        </div>
        <div className="card p-5">
          <p className="font-display text-base font-semibold text-forest-ink">Joined clubs</p>
          {user.joinedClubs?.length ? (
            <ul className="mt-2 space-y-1.5 text-sm">
              {user.joinedClubs.map((c, i) => (
                <li key={c._id} className="reveal" style={{ '--i': i }}>
                  <Link to={`/clubs/${c._id}`} className="group text-ink hover:text-forest">
                    <span className="link-draw">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">None yet.</p>
          )}
        </div>
      </div>

      <form onSubmit={handlePasswordChange} className="card mt-6 space-y-4 p-6">
        <p className="flex items-center gap-2 font-display text-base font-semibold text-forest-ink">
          <KeyRound size={17} /> Change password
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Current password</label>
            <input
              type="password"
              className="input-field"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">New password</label>
            <input
              type="password"
              minLength={6}
              className="input-field"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            />
          </div>
        </div>
        {pwError && <p className="text-sm text-brick">{pwError}</p>}
        {pwMessage && <p className="text-sm text-forest-light">{pwMessage}</p>}
        <button type="submit" disabled={pwSaving} className="btn-secondary">
          {pwSaving && <Loader2 size={16} className="animate-spin" />}
          Update password
        </button>
      </form>
    </div>
  );
}

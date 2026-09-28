import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthBrandPanel from '../../components/common/AuthBrandPanel';
import usePageTitle from '../../hooks/usePageTitle';

const initialForm = { name: '', email: '', password: '', studentId: '', department: '', batch: '' };

export default function Signup() {
  usePageTitle('Create your account');
  const { signup, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await signup(form);
    setSubmitting(false);
    if (ok) navigate('/dashboard', { replace: true });
  };

  return (
    <div className="auth-page grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        headline="One record for your whole university life."
        subcopy="Register once to enroll in courses, join clubs, RSVP to events, and message anyone on campus."
      />

      <div className="auth-form-panel relative flex items-center justify-center overflow-hidden bg-parchment px-6 py-12">\n        <div className="relative z-10 w-full max-w-sm animate-page-in">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0">
              <path d="M32 4 L58 14 V30 C58 46 47 57 32 61 C17 57 6 46 6 30 V14 Z" fill="#14302A" />
              <path
                className="logo-draw"
                d="M32 19 L32 46 M20 27 L44 27 M22 36 L42 36"
                fill="none"
                stroke="#BF9A3A"
                strokeWidth="3.4"
                strokeLinecap="round"
                pathLength="1"
              />
            </svg>
            <span className="font-display text-lg font-semibold text-forest-ink">AcademiaConnect</span>
          </div>

          <h1 className="page-heading">Create your account</h1>
          <div className="ledger-rule my-3" />
          <p className="text-sm text-ink-muted">It takes less than a minute.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            <div className="register-row" style={{ '--d': '0.05s' }}>
              <label className="field-label" htmlFor="name">Full name</label>
              <input id="name" required autoFocus className="input-field auth-input" value={form.name} onChange={update('name')} />
            </div>
            <div className="register-row" style={{ '--d': '0.12s' }}>
              <label className="field-label" htmlFor="email">Email</label>
              <input id="email" type="email" required className="input-field auth-input" value={form.email} onChange={update('email')} />
            </div>
            <div className="register-row" style={{ '--d': '0.19s' }}>
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="input-field auth-input"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={update('password')}
              />
            </div>
            <div className="register-row grid grid-cols-2 gap-3" style={{ '--d': '0.26s' }}>
              <div>
                <label className="field-label" htmlFor="studentId">Student ID</label>
                <input id="studentId" className="input-field auth-input" value={form.studentId} onChange={update('studentId')} />
              </div>
              <div>
                <label className="field-label" htmlFor="batch">Batch</label>
                <input id="batch" placeholder="e.g. Fall 2026" className="input-field auth-input" value={form.batch} onChange={update('batch')} />
              </div>
            </div>
            <div className="register-row" style={{ '--d': '0.33s' }}>
              <label className="field-label" htmlFor="department">Department</label>
              <input id="department" placeholder="e.g. Computer Science & Engineering" className="input-field auth-input" value={form.department} onChange={update('department')} />
            </div>

            {error && (
              <p className="animate-shake rounded bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary btn-glow w-full">
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already registered?{' '}
            <Link to="/login" className="group font-medium text-forest">
              <span className="link-draw">Log in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

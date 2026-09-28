import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthBrandPanel from '../../components/common/AuthBrandPanel';
import usePageTitle from '../../hooks/usePageTitle';

export default function Login() {
  usePageTitle('Log in');
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(form.email, form.password);
    setSubmitting(false);
    if (ok) navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
  };

  return (
    <div className="auth-page grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        headline="Every course, club, and notice on campus, recorded in one place."
        subcopy="Sign in with your university account to reach your courses, join clubs, keep up with events, and message classmates."
      />

      {/* Form panel */}
      <div className="auth-form-panel relative flex items-center justify-center overflow-hidden bg-parchment px-6 py-12">        <div className="relative z-10 w-full max-w-sm animate-page-in">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
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

          <h1 className="page-heading">Welcome back</h1>
          <div className="ledger-rule my-3" />
          <p className="text-sm text-ink-muted">Log in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                className="input-field auth-input"
                placeholder="you@student.academiaconnect.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                className="input-field auth-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <p className="animate-shake rounded bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary btn-glow w-full">
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            New here?{' '}
            <Link to="/signup" className="group font-medium text-forest">
              <span className="link-draw">Create an account</span>
            </Link>
          </p>

          <div className="mt-8 rounded border border-hairline bg-paper p-3.5 text-xs text-ink-muted">
            <p className="font-medium text-ink">Demo credentials (after running the seed script)</p>
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5">
              Admin: <kbd className="kbd">admin@academiaconnect.edu</kbd> / <kbd className="kbd">admin123</kbd>
            </p>
            <p className="mt-1.5 flex flex-wrap items-center gap-1.5">
              Student: <kbd className="kbd">ayesha.rahman@student.academiaconnect.edu</kbd> / <kbd className="kbd">password123</kbd>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

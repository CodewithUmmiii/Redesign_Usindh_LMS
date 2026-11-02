import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, Zap, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Logo } from '../components/ui/Brand';
import { Field } from '../components/ui';
import { UNIVERSITY } from '../config/env';

const DEMO = { teacher: 'teacher@demo.usindh.local', student: 'student@demo.usindh.local', admin: 'admin@demo.usindh.local' };

export default function Login() {
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState('teacher');
  const [email, setEmail] = useState(DEMO.teacher);
  const [password, setPassword] = useState('demo1234');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const pick = (r) => { setRole(r); setEmail(DEMO[r]); };
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await login({ role, email, password }); navigate('/dashboard'); }
    catch (err) { toast(err.message || 'Sign-in failed', 'error'); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth">
      <section className="auth-hero">
        <div className="row" style={{ gap: 14 }}>
          <Logo size={56} />
          <div><b style={{ fontSize: 18 }}>{UNIVERSITY.name}</b><div style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>{UNIVERSITY.city} · Pakistan</div></div>
        </div>
        <div>
          <h2>One calm place for <span>teaching, learning</span> and results.</h2>
          <p className="lead">The LMS portal, reengineered around what faculty told us: simpler navigation, stronger course tools, and self-service results.</p>
          <div className="auth-points">
            <div><Zap /> Faster to learn — grouped, role-based navigation</div>
            <div><Smartphone /> Works on phones and tablets</div>
            <div><ShieldCheck /> Clear separation of student, teacher and admin tools</div>
          </div>
        </div>
        <small style={{ color: '#9ec7bb' }}>Software Reengineering assignment · frontend prototype</small>
      </section>

      <section className="auth-form-wrap">
        <form className="auth-card" onSubmit={submit}>
          <div><h3>Welcome back</h3><p className="muted">Sign in to your LMS account</p></div>
          <div className="role-tabs" role="tablist" aria-label="Sign in as">
            {['teacher', 'student', 'admin'].map((r) => <button type="button" key={r} className={role === r ? 'on' : ''} onClick={() => pick(r)}>{r}</button>)}
          </div>
          <Field label="University email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></Field>
          <Field label="Password"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></Field>
          <button className="btn primary block" disabled={busy}><LogIn /> {busy ? 'Signing in…' : 'Sign in'}</button>
          <p className="proto-note">Prototype mode: any password works and sample data is stored only in this browser. No real university accounts are used.</p>
        </form>
      </section>
    </div>
  );
}

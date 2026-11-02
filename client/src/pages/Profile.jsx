import { useState } from 'react';
import { Save, KeyRound, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resetDemoData } from '../services/miscService';
import { Card, CardHead, PageHead, Avatar, Field, Toggle, Badge } from '../components/ui';

export default function Profile() {
  const { user, saveProfile, logout } = useAuth();
  const toast = useToast();
  const [f, setF] = useState(user);
  const [prefs, setPrefs] = useState({ deadlines: true, messages: true, results: true, email: false });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    if (!f.name.trim()) return toast('Name cannot be empty', 'error');
    setBusy(true); await saveProfile(f); setBusy(false); toast('Profile updated');
  };

  return (
    <>
      <PageHead title="My profile" subtitle="Update how your name and contact details appear across the portal." />
      <div className="grid sidebar-right">
        <div className="stack">
          <Card>
            <CardHead title="Personal details" subtitle="Your display name is editable (requested in the survey)." />
            <div className="card-body stack">
              <div className="row" style={{ gap: 18 }}><Avatar name={f.name} size="lg" /><div><h3>{f.name}</h3><Badge tone="info">{user.role}</Badge></div></div>
              <div className="grid cols-2">
                <Field label="Display name"><input value={f.name} onChange={set('name')} /></Field>
                <Field label="University email"><input value={f.email} onChange={set('email')} type="email" /></Field>
                <Field label="Phone"><input value={f.phone || ''} onChange={set('phone')} /></Field>
                {user.role === 'student' ? <Field label="Roll number"><input value={f.rollNo} disabled /></Field> : <Field label="Designation"><input value={f.designation || ''} onChange={set('designation')} /></Field>}
                {user.role === 'student' ? <Field label="Program"><input value={f.program} disabled /></Field> : <Field label="Department"><input value={f.department || ''} onChange={set('department')} /></Field>}
              </div>
              <div className="row"><button className="btn primary" onClick={save} disabled={busy}><Save /> {busy ? 'Saving…' : 'Save changes'}</button><button className="btn ghost" onClick={() => setF(user)}>Reset</button></div>
            </div>
          </Card>
          <Card>
            <CardHead title="Security" />
            <div className="card-body grid cols-3"><Field label="Current password"><input type="password" autoComplete="current-password" /></Field><Field label="New password"><input type="password" autoComplete="new-password" /></Field>
              <div style={{ alignSelf: 'end' }}><button className="btn ghost" onClick={() => toast('Password change is wired to the API in the full build')}><KeyRound /> Update password</button></div></div>
          </Card>
        </div>
        <div className="stack">
          <Card>
            <CardHead title="Notification preferences" />
            {[['deadlines', 'Assignment & quiz deadlines'], ['messages', 'New messages'], ['results', 'Marks & results published'], ['email', 'Also send to university email']].map(([k, label]) => (
              <div className="list-item" key={k}><div className="grow"><b style={{ fontWeight: 600 }}>{label}</b></div><Toggle checked={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} label={label} /></div>
            ))}
          </Card>
          <Card className="card-pad stack" style={{ gap: 10 }}>
            <b>Prototype tools</b>
            <p className="muted" style={{ fontSize: 13.5 }}>Sample data is saved in this browser only.</p>
            <button className="btn ghost" onClick={() => { resetDemoData(); toast('Sample data reset'); setTimeout(() => { logout(); window.location.href = '/login'; }, 600); }}><RotateCcw /> Reset sample data</button>
          </Card>
        </div>
      </div>
    </>
  );
}

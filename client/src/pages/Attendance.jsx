import { useEffect, useMemo, useState } from 'react';
import { Check, X, Clock, Save, CheckCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { listCourses, listStudents } from '../services/courseService';
import { getSheet, saveSheet, getHistory } from '../services/attendanceService';
import { Card, CardHead, Badge, PageHead, Progress, Avatar, Skeleton, Stat, Tabs } from '../components/ui';
import { Ring } from '../components/charts';
import { todayKey, fmtDate } from '../utils/format';

const OPTS = [
  { v: 'P', label: 'Present', icon: Check, cls: 'p' },
  { v: 'A', label: 'Absent', icon: X, cls: 'a' },
  { v: 'L', label: 'Late', icon: Clock, cls: 'l' },
];

function TeacherView() {
  const toast = useToast();
  const courses = useAsync(listCourses);
  const mine = (courses.data || []).filter((c) => c.teacher.startsWith('Dr. Ayesha'));
  const [courseId, setCourseId] = useState('c1');
  const [date, setDate] = useState(todayKey());
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false); // controls stay locked until the saved sheet (if any) has loaded
  const [tab, setTab] = useState('mark');
  const students = useAsync(() => listStudents(courseId), [courseId]);
  const history = useAsync(() => getHistory(courseId), [courseId, saving]);
  const list = students.data || [];

  useEffect(() => {
    if (!list.length) return undefined;
    let cancelled = false;
    setReady(false);
    getSheet(courseId, date).then((s) => {
      if (cancelled) return;
      setMarks(s || Object.fromEntries(list.map((x) => [x.id, 'P'])));
      setReady(true);
    });
    return () => { cancelled = true; };
  }, [courseId, date, students.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => Object.values(marks).reduce((a, v) => ({ ...a, [v]: (a[v] || 0) + 1 }), { P: 0, A: 0, L: 0 }), [marks]);
  const pct = list.length ? Math.round(((counts.P + counts.L) / list.length) * 100) : 0;
  const all = (v) => setMarks(Object.fromEntries(list.map((s) => [s.id, v])));
  const save = async () => { setSaving(true); await saveSheet(courseId, date, marks); setSaving(false); toast(`Attendance saved for ${fmtDate(date)} — synced to department system`); };

  return (
    <>
      <PageHead title="Attendance" subtitle="Mark a whole class in one screen. Changes sync to the attendance system when you save."
        actions={<button className="btn primary" onClick={save} disabled={saving || !ready}><Save /> {saving ? 'Saving…' : 'Save attendance'}</button>} />
      <Tabs value={tab} onChange={setTab} tabs={[{ value: 'mark', label: 'Mark attendance' }, { value: 'history', label: 'History' }, { value: 'risk', label: 'Low attendance' }]} />
      <div className="card card-pad row wrap" style={{ marginBottom: 16, gap: 16 }}>
        <label className="field" style={{ minWidth: 240 }}>Course
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>{mine.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}</select></label>
        <label className="field">Date<input type="date" value={date} max={todayKey()} onChange={(e) => setDate(e.target.value)} /></label>
      </div>

      {tab === 'mark' && (
        <div className="grid sidebar-right">
          <Card>
            <CardHead title={`Class roster (${list.length})`} action={<div className="row"><button className="btn sm ghost" disabled={!ready} onClick={() => all('P')}><CheckCheck /> All present</button><button className="btn sm ghost" disabled={!ready} onClick={() => all('A')}>All absent</button></div>} />
            {students.loading ? <div style={{ padding: 20 }}><Skeleton n={3} /></div> : list.map((s, i) => (
              <div className="list-item att-row" key={s.id}>
                <span className="muted" style={{ width: 22, fontWeight: 700 }}>{i + 1}</span>
                <Avatar name={s.name} size="sm" />
                <div className="grow"><b>{s.name}</b><small>{s.rollNo} · overall {s.attendance}%</small></div>
                <div className="att-seg" role="radiogroup" aria-label={`Attendance for ${s.name}`}>
                  {OPTS.map(({ v, label, icon: Icon, cls }) => (
                    <button key={v} role="radio" aria-checked={marks[s.id] === v} disabled={!ready} className={`${cls} ${marks[s.id] === v ? 'on' : ''}`} onClick={() => setMarks({ ...marks, [s.id]: v })} title={label}><Icon size={14} /><span>{label}</span></button>
                  ))}
                </div>
              </div>
            ))}
          </Card>
          <div className="stack" style={{ alignSelf: 'start', position: 'sticky', top: 84 }}>
            <Card className="card-pad row" style={{ gap: 18 }}>
              <Ring value={pct} size={96} stroke={10} />
              <div><h3>Today's turnout</h3><p className="muted">{counts.P} present · {counts.L} late · {counts.A} absent</p></div>
            </Card>
            <div className="grid cols-3" style={{ gap: 10 }}>
              <Card className="card-pad" style={{ textAlign: 'center' }}><b style={{ fontSize: 24, color: 'var(--ok)' }}>{counts.P}</b><br /><small className="muted">Present</small></Card>
              <Card className="card-pad" style={{ textAlign: 'center' }}><b style={{ fontSize: 24, color: 'var(--warn)' }}>{counts.L}</b><br /><small className="muted">Late</small></Card>
              <Card className="card-pad" style={{ textAlign: 'center' }}><b style={{ fontSize: 24, color: 'var(--danger)' }}>{counts.A}</b><br /><small className="muted">Absent</small></Card>
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <Card>
          <CardHead title="Saved sessions" subtitle="Sessions you have saved for this course" />
          <div className="table-wrap"><table className="table"><thead><tr><th>Date</th><th>Present</th><th>Late</th><th>Absent</th><th>Turnout</th></tr></thead><tbody>
            {(history.data || []).length === 0 && <tr><td colSpan={5} className="muted" style={{ textAlign: 'center', padding: 30 }}>No saved sessions yet — mark and save attendance first.</td></tr>}
            {(history.data || []).map((h) => {
              const v = Object.values(h.marks); const p = v.filter((x) => x === 'P').length; const l = v.filter((x) => x === 'L').length; const a = v.filter((x) => x === 'A').length;
              return <tr key={h.date}><td><b>{fmtDate(h.date)}</b></td><td>{p}</td><td>{l}</td><td>{a}</td><td><Badge tone={(p + l) / v.length >= 0.75 ? 'ok' : 'warn'}>{Math.round(((p + l) / v.length) * 100)}%</Badge></td></tr>;
            })}</tbody></table></div>
        </Card>
      )}

      {tab === 'risk' && (
        <Card>
          <CardHead title="Students below 75%" subtitle="Highlighted automatically so you can follow up early" />
          {list.filter((s) => s.attendance < 75).map((s) => (
            <div className="list-item" key={s.id}><AlertTriangle color="var(--danger)" /><div className="grow"><b>{s.name}</b><small>{s.rollNo}</small></div><div style={{ width: 160 }}><Progress value={s.attendance} tone="red" /></div><Badge tone="danger">{s.attendance}%</Badge></div>
          ))}
        </Card>
      )}
    </>
  );
}

function StudentView() {
  const courses = useAsync(listCourses);
  const rows = (courses.data || []).filter((c) => c.semester === 7).map((c, i) => ({ ...c, pct: [92, 84, 71][i] ?? 88, held: [28, 26, 14][i] ?? 20 }));
  return (
    <>
      <PageHead title="My attendance" subtitle="Your attendance per course. Below 75% may affect exam eligibility." />
      <div className="grid cols-3">
        {rows.map((c) => (
          <Card key={c.id} className="card-pad row" style={{ gap: 16 }}>
            <Ring value={c.pct} size={74} stroke={8} color={c.pct < 75 ? 'var(--danger)' : 'var(--brand-600)'} />
            <div className="grow"><b>{c.title}</b><br /><small className="muted">{c.code} · {Math.round(c.held * c.pct / 100)}/{c.held} classes</small><div style={{ marginTop: 6 }}>{c.pct < 75 ? <Badge tone="danger">Short attendance</Badge> : <Badge tone="ok">On track</Badge>}</div></div>
          </Card>
        ))}
      </div>
    </>
  );
}

function AdminView() {
  const courses = useAsync(listCourses);
  return (
    <>
      <PageHead title="Attendance overview" subtitle="Department-wide view (sample data)." />
      <div className="grid cols-4"><Stat icon={Check} value="88%" label="Avg turnout" /><Stat icon={AlertTriangle} value="9" label="Below 75%" tone="red" /><Stat icon={Clock} value="4" label="Sheets pending" tone="gold" /><Stat icon={CheckCheck} value="96%" label="Sheets submitted" tone="blue" /></div>
      <Card style={{ marginTop: 16 }}>
        <CardHead title="By course" />
        {(courses.data || []).map((c, i) => <div className="list-item" key={c.id}><div className="grow"><b>{c.title}</b><small>{c.code} · {c.teacher}</small></div><div style={{ width: 200 }}><Progress value={[90, 86, 78, 92][i]} /></div><b>{[90, 86, 78, 92][i]}%</b></div>)}
      </Card>
    </>
  );
}

export default function Attendance() {
  const { user } = useAuth();
  return user.role === 'teacher' ? <TeacherView /> : user.role === 'student' ? <StudentView /> : <AdminView />;
}

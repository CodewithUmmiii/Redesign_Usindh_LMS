import { useEffect, useMemo, useState } from 'react';
import { Download, Printer, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { listCourses } from '../services/courseService';
import { getGradebook, saveGradebook, getMyResults } from '../services/resultService';
import { Card, CardHead, Badge, PageHead, Tabs, Skeleton, Stat } from '../components/ui';
import { Logo } from '../components/ui/Brand';
import { UNIVERSITY } from '../config/env';
import { GRADE_SCALE } from '../data/mock';
import { totalFor, gradeFor, gpa } from '../utils/grading';
import { downloadCsv } from '../utils/download';
import { Award, Users, TrendingUp } from 'lucide-react';

function GradeScale() {
  return (
    <Card>
      <CardHead title="Grading scale" subtitle="Existing university scale — unchanged by this reengineering" />
      <div className="row wrap" style={{ padding: 16, gap: 8 }}>{GRADE_SCALE.map((g) => <Badge key={g.grade} tone={g.grade === 'F' ? 'danger' : 'ok'}>{g.grade} · ≥{g.min}% · {g.gp.toFixed(1)}</Badge>)}</div>
    </Card>
  );
}

function Gradebook({ readOnly }) {
  const toast = useToast();
  const courses = useAsync(listCourses);
  const [courseId, setCourseId] = useState('c1');
  const [tab, setTab] = useState('marks');
  const gb = useAsync(() => getGradebook(courseId), [courseId]);
  const [dist, setDist] = useState([]);
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (gb.data) { setDist(gb.data.distribution); setMarks(gb.data.marks); } }, [gb.data]);
  const totalWeight = dist.reduce((s, d) => s + (Number(d.weight) || 0), 0);
  const students = gb.data?.students || [];

  const rows = useMemo(() => students.map((s) => {
    const t = totalFor(marks[s.id], dist); return { ...s, total: t, g: gradeFor(t) };
  }), [students, marks, dist]);
  const passRate = rows.length ? Math.round((rows.filter((r) => r.g.grade !== 'F').length / rows.length) * 100) : 0;
  const avg = rows.length ? (rows.reduce((s, r) => s + r.total, 0) / rows.length).toFixed(1) : 0;

  const save = async () => {
    if (totalWeight !== 100) return toast(`Weights must total 100 (currently ${totalWeight})`, 'error');
    setSaving(true); await saveGradebook(courseId, { distribution: dist, marks }); setSaving(false); toast('Gradebook saved');
  };
  const setMark = (sid, key, v, max) => setMarks({ ...marks, [sid]: { ...marks[sid], [key]: Math.max(0, Math.min(max, Number(v) || 0)) } });
  const setDistRow = (i, p) => setDist(dist.map((d, j) => (j === i ? { ...d, ...p } : d)));

  return (
    <>
      <PageHead title="Results & Marks" subtitle={readOnly ? 'View-only gradebook for administrators.' : 'Edit marks distribution, enter marks and see grades update instantly.'}
        actions={<>
          <button className="btn ghost" onClick={() => downloadCsv(`gradebook-${courseId}.csv`, [['Roll no', 'Name', ...dist.map((d) => d.label), 'Total', 'Grade'], ...rows.map((r) => [r.rollNo, r.name, ...dist.map((d) => marks[r.id]?.[d.key] ?? 0), r.total, r.g.grade])])}><Download /> Export CSV</button>
          {!readOnly && <button className="btn primary" onClick={save} disabled={saving}><Save /> {saving ? 'Saving…' : 'Save changes'}</button>}
        </>} />
      <div className="card card-pad row wrap" style={{ marginBottom: 16, gap: 16 }}>
        <label className="field" style={{ minWidth: 260 }}>Course<select value={courseId} onChange={(e) => setCourseId(e.target.value)}>{(courses.data || []).map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}</select></label>
      </div>
      <div className="grid cols-3" style={{ marginBottom: 16 }}>
        <Stat icon={Users} value={rows.length} label="Students" /><Stat icon={TrendingUp} value={avg} label="Average total" tone="blue" /><Stat icon={Award} value={`${passRate}%`} label="Pass rate" tone="gold" />
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ value: 'marks', label: 'Enter marks' }, { value: 'dist', label: 'Marks distribution' }, { value: 'scale', label: 'Grading scale' }]} />

      {tab === 'marks' && (gb.loading ? <Skeleton n={3} /> : (
        <Card><div className="table-wrap"><table className="table">
          <thead><tr><th>Student</th>{dist.map((d) => <th key={d.key}>{d.label} <span className="muted">/{d.weight}</span></th>)}<th>Total</th><th>Grade</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}><td><b>{r.name}</b><br /><small className="muted">{r.rollNo}</small></td>
              {dist.map((d) => <td key={d.key}><input type="number" min="0" max={d.weight} value={marks[r.id]?.[d.key] ?? 0} disabled={readOnly} onChange={(e) => setMark(r.id, d.key, e.target.value, d.weight)} aria-label={`${d.label} marks for ${r.name}`} /></td>)}
              <td><b>{r.total}</b></td><td><Badge tone={r.g.grade === 'F' ? 'danger' : r.g.gp >= 3.7 ? 'ok' : 'info'}>{r.g.grade}</Badge></td></tr>
          ))}</tbody></table></div></Card>
      ))}

      {tab === 'dist' && (
        <Card>
          <CardHead title="Marks distribution" subtitle="Rename components and change their weight. Total must equal 100." action={!readOnly && <button className="btn sm ghost" onClick={() => setDist([...dist, { key: `x${Date.now()}`, label: 'New component', weight: 0 }])}><Plus /> Add component</button>} />
          <div className="card-body stack">
            {dist.map((d, i) => (
              <div className="row" key={d.key}>
                <input value={d.label} disabled={readOnly} onChange={(e) => setDistRow(i, { label: e.target.value })} aria-label="Component name" />
                <input type="number" min="0" max="100" style={{ width: 110 }} disabled={readOnly} value={d.weight} onChange={(e) => setDistRow(i, { weight: Number(e.target.value) })} aria-label="Weight" />
                {!readOnly && <button className="icon-btn" onClick={() => setDist(dist.filter((_, j) => j !== i))} aria-label="Remove component"><Trash2 size={16} /></button>}
              </div>
            ))}
            <div className="row between" style={{ padding: '10px 14px', borderRadius: 10, background: totalWeight === 100 ? 'var(--ok-bg)' : 'var(--danger-bg)', color: totalWeight === 100 ? 'var(--ok)' : 'var(--danger)', fontWeight: 800 }}>
              <span className="row" style={{ gap: 8 }}>{totalWeight !== 100 && <AlertCircle size={16} />}Total weight</span><span>{totalWeight} / 100</span>
            </div>
          </div>
        </Card>
      )}
      {tab === 'scale' && <GradeScale />}
    </>
  );
}

function StudentResults() {
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading } = useAsync(getMyResults);
  const g = data ? gpa(data) : 0;
  const exportCsv = () => { downloadCsv(`marksheet-${user.rollNo.replace(/\//g, '-')}.csv`, [['Code', 'Course', 'Credits', 'Total', 'Grade', 'GP'], ...data.map((r) => [r.code, r.title, r.credits, r.total, r.grade, r.gp])]); toast('Marksheet CSV downloaded'); };

  return (
    <>
      <PageHead title="My Results" subtitle="View your marks and download your own marksheet — no need to visit the department."
        actions={<><button className="btn ghost" onClick={exportCsv} disabled={!data}><Download /> CSV</button><button className="btn primary" onClick={() => window.print()} disabled={!data}><Printer /> Download marksheet (PDF)</button></>} />
      {loading ? <Skeleton n={3} /> : (
        <div className="stack">
          <div className="grid cols-3"><Stat icon={Award} value={g.toFixed(2)} label="Semester GPA (sample)" /><Stat icon={TrendingUp} value={data.length} label="Courses" tone="blue" /><Stat icon={Users} value={data.reduce((s, r) => s + r.credits, 0)} label="Credit hours" tone="gold" /></div>
          <Card className="print-area">
            <div className="marksheet-head">
              <Logo size={54} />
              <div><h3>{UNIVERSITY.name}, {UNIVERSITY.city}</h3><p className="muted">Provisional marksheet · Semester {user.semester}</p></div>
            </div>
            <div className="card-body grid cols-2" style={{ paddingBottom: 0 }}>
              <div><small className="muted">Student</small><br /><b>{user.name}</b></div>
              <div><small className="muted">Roll number · Program</small><br /><b>{user.rollNo} · {user.program}</b></div>
            </div>
            <div className="table-wrap" style={{ marginTop: 14 }}><table className="table">
              <thead><tr><th>Code</th><th>Course</th><th>Credits</th><th>Total</th><th>Grade</th><th>GP</th></tr></thead>
              <tbody>{data.map((r) => <tr key={r.code}><td><b>{r.code}</b></td><td>{r.title}</td><td>{r.credits}</td><td>{r.total}</td><td><Badge tone="ok">{r.grade}</Badge></td><td>{r.gp.toFixed(1)}</td></tr>)}</tbody>
              <tfoot><tr><td colSpan={5} style={{ textAlign: 'right', padding: 14 }}><b>GPA</b></td><td><b>{g.toFixed(2)}</b></td></tr></tfoot></table></div>
            <p className="muted" style={{ padding: '0 20px 18px', fontSize: 12.5 }}>Sample data for a reengineering prototype — not an official transcript.</p>
          </Card>
          <GradeScale />
        </div>
      )}
    </>
  );
}

export default function Results() {
  const { user } = useAuth();
  return user.role === 'student' ? <StudentResults /> : <Gradebook readOnly={user.role === 'admin'} />;
}

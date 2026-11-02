import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileText, Upload, Trash2, CheckCircle2, Circle, Megaphone, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { getCourse, toggleTopic, listMaterials, addMaterial, removeMaterial, listStudents, listAnnouncements, postAnnouncement } from '../services/courseService';
import { Card, CardHead, Badge, PageHead, Progress, Tabs, Skeleton, Empty, Field, Avatar } from '../components/ui';
import { Ring } from '../components/charts';
import { fmtDate } from '../utils/format';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const isTeacher = user.role === 'teacher';
  const [tab, setTab] = useState('overview');
  const course = useAsync(() => getCourse(id), [id]);
  const materials = useAsync(() => listMaterials(id), [id]);
  const students = useAsync(() => listStudents(id), [id]);
  const ann = useAsync(listAnnouncements);
  const [over, setOver] = useState(false);
  const [draft, setDraft] = useState({ title: '', body: '' });

  if (course.loading) return <Skeleton n={3} h={140} />;
  const c = course.data;
  if (!c) return <Card><Empty title="Course not found" /></Card>;
  const done = c.topics.filter((t) => t[1]).length;
  const pct = (done / c.topics.length) * 100;

  const onFiles = async (files) => {
    for (const f of files) await addMaterial(id, f);
    materials.reload(); toast(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
  };
  const flip = async (i) => { if (!isTeacher) return; const next = await toggleTopic(id, i); course.setData(next); };
  const post = async () => {
    if (!draft.title.trim()) return toast('Add a title first', 'error');
    await postAnnouncement({ courseId: id, ...draft }); setDraft({ title: '', body: '' }); ann.reload(); toast('Announcement posted to the class');
  };

  return (
    <>
      <PageHead crumbs={<><Link to="/courses">Courses</Link> / {c.code}</>} title={c.title}
        subtitle={`${c.code} · Semester ${c.semester} · Section ${c.section} · ${c.teacher}`} actions={<Badge tone="info">{c.schedule}</Badge>} />
      <Tabs value={tab} onChange={setTab} tabs={[
        { value: 'overview', label: 'Overview & progress' }, { value: 'materials', label: 'Materials' },
        { value: 'students', label: 'Students' }, { value: 'announce', label: 'Announcements' },
      ]} />

      {tab === 'overview' && (
        <div className="grid sidebar-right">
          <Card>
            <CardHead title="Syllabus tracker" subtitle={isTeacher ? 'Tick a topic once it has been taught — students see this progress.' : 'Topics covered so far by your instructor.'} />
            {c.topics.map(([name, ok], i) => (
              <button key={name} className="list-item topic" onClick={() => flip(i)} disabled={!isTeacher} aria-pressed={ok}>
                {ok ? <CheckCircle2 color="var(--brand-600)" /> : <Circle color="var(--text-3)" />}
                <span className="grow" style={{ textAlign: 'left', fontWeight: 600, textDecoration: ok ? 'none' : 'none', color: ok ? 'var(--text)' : 'var(--text-2)' }}>{i + 1}. {name}</span>
                <Badge tone={ok ? 'ok' : 'neutral'}>{ok ? 'Covered' : 'Upcoming'}</Badge>
              </button>
            ))}
          </Card>
          <div className="stack">
            <Card className="card-pad row" style={{ gap: 18 }}>
              <Ring value={pct} size={92} stroke={9} color={c.color} />
              <div><h3>{Math.round(pct)}% covered</h3><p className="muted">{done} of {c.topics.length} topics</p></div>
            </Card>
            <Card className="card-pad stack" style={{ gap: 10 }}>
              <div className="row between"><span className="muted">Enrolled</span><b>{c.students}</b></div>
              <div className="row between"><span className="muted">Credits</span><b>{c.credits}</b></div>
              <div className="row between"><span className="muted">Room</span><b>{c.room}</b></div>
              <div className="row between"><span className="muted">Materials</span><b>{materials.data?.length ?? '—'}</b></div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'materials' && (
        <div className="stack">
          {isTeacher && (
            <label className={`dropzone ${over ? 'over' : ''}`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); onFiles([...e.dataTransfer.files]); }}>
              <Upload /><div><b>Drag & drop files</b> or click to browse</div><small>PDF, slides, docs — uploads are simulated in this prototype</small>
              <input type="file" multiple hidden onChange={(e) => onFiles([...e.target.files])} />
            </label>
          )}
          <Card>
            <CardHead title="Course materials" />
            {materials.loading ? <div style={{ padding: 20 }}><Skeleton /></div> : (materials.data || []).length === 0 ? <Empty icon={FileText} title="No materials yet" hint={isTeacher ? 'Upload your first file above.' : 'Your instructor has not uploaded anything.'} /> :
              materials.data.map((m) => (
                <div className="list-item" key={m.id}>
                  <div className="file-ico"><FileText /></div>
                  <div className="grow"><b>{m.name}</b><small>{m.size} · {fmtDate(m.at)}</small></div>
                  <button className="btn sm ghost" onClick={() => toast('Download started (simulated)')}><Download /> Download</button>
                  {isTeacher && <button className="icon-btn" aria-label={`Delete ${m.name}`} onClick={async () => { await removeMaterial(id, m.id); materials.reload(); toast('File removed'); }}><Trash2 size={16} /></button>}
                </div>
              ))}
          </Card>
        </div>
      )}

      {tab === 'students' && (
        <Card>
          <CardHead title="Class roster" subtitle={`${students.data?.length ?? 0} students shown (sample)`} />
          <div className="table-wrap"><table className="table"><thead><tr><th>Student</th><th>Roll no.</th><th>Attendance</th></tr></thead>
            <tbody>{(students.data || []).map((s) => (
              <tr key={s.id}><td><div className="row"><Avatar name={s.name} size="sm" />{s.name}</div></td><td>{s.rollNo}</td>
                <td style={{ minWidth: 180 }}><div className="row"><div style={{ flex: 1 }}><Progress value={s.attendance} tone={s.attendance < 75 ? 'red' : ''} /></div><b>{s.attendance}%</b></div></td></tr>
            ))}</tbody></table></div>
        </Card>
      )}

      {tab === 'announce' && (
        <div className="grid sidebar-right">
          <Card>
            <CardHead title="Announcements" />
            {(ann.data || []).filter((a) => a.courseId === id).length === 0 ? <Empty icon={Megaphone} title="No announcements" /> :
              ann.data.filter((a) => a.courseId === id).map((a) => (
                <div className="list-item" key={a.id}><div className="file-ico" style={{ background: 'var(--gold-100)', color: '#8a6212' }}><Megaphone /></div><div className="grow"><b>{a.title}</b><small>{a.body} · {fmtDate(a.at)}</small></div></div>
              ))}
          </Card>
          {isTeacher && (
            <Card className="card-pad stack">
              <h3>Post to class</h3>
              <Field label="Title"><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
              <Field label="Message"><textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></Field>
              <button className="btn primary" onClick={post}><Megaphone /> Notify students</button>
            </Card>
          )}
        </div>
      )}
    </>
  );
}

import { useState } from 'react';
import { Plus, Upload, CheckCircle2, Clock, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { listCourses } from '../services/courseService';
import { listAssignments, createAssignment, submitAssignment } from '../services/assignmentService';
import { Card, CardHead, Badge, PageHead, Progress, Modal, Field, Segmented, Skeleton, Empty } from '../components/ui';
import { fmtDateTime, relativeDay } from '../utils/format';

export default function Assignments() {
  const { user } = useAuth();
  const toast = useToast();
  const isTeacher = user.role === 'teacher';
  const courses = useAsync(listCourses);
  const { data, loading, reload } = useAsync(listAssignments);
  const [filter, setFilter] = useState('all');
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(null);
  const [form, setForm] = useState({ courseId: 'c1', title: '', description: '', total: 10, due: '' });
  const [file, setFile] = useState(null);
  const code = (id) => courses.data?.find((c) => c.id === id)?.code;

  const rows = (data || []).filter((a) => {
    if (filter === 'all') return true;
    if (isTeacher) return filter === 'open' ? new Date(a.due) > new Date() : new Date(a.due) <= new Date();
    return a.mine.status === filter;
  });

  const create = async () => {
    if (!form.title.trim() || !form.due) return toast('Title and due date are required', 'error');
    await createAssignment({ ...form, total: Number(form.total), due: new Date(form.due).toISOString() });
    setCreating(false); setForm({ ...form, title: '', description: '' }); reload(); toast('Assignment published to students');
  };
  const submit = async () => {
    if (!file) return toast('Choose a file to submit', 'error');
    await submitAssignment(submitting.id, file.name); setSubmitting(null); setFile(null); reload(); toast('Submitted successfully');
  };

  return (
    <>
      <PageHead title="Assignments" subtitle={isTeacher ? 'Create, track and grade submissions.' : 'Everything due, submitted and graded.'}
        actions={<>
          <Segmented value={filter} onChange={setFilter} options={isTeacher ? [{ value: 'all', label: 'All' }, { value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }] : [{ value: 'all', label: 'All' }, { value: 'pending', label: 'To do' }, { value: 'submitted', label: 'Submitted' }, { value: 'graded', label: 'Graded' }]} />
          {isTeacher && <button className="btn primary" onClick={() => setCreating(true)}><Plus /> New assignment</button>}
        </>} />
      {loading ? <Skeleton n={3} /> : rows.length === 0 ? <Card><Empty icon={FileText} title="Nothing here" hint="No assignments match this filter." /></Card> : (
        <div className="grid cols-2">
          {rows.map((a) => {
            const overdue = new Date(a.due) < new Date();
            return (
              <Card key={a.id} className="card-pad stack" style={{ gap: 12 }}>
                <div className="row between"><Badge tone="info">{code(a.courseId)}</Badge>
                  {isTeacher ? <Badge tone={overdue ? 'neutral' : 'ok'}>{overdue ? 'Closed' : 'Open'}</Badge> :
                    a.mine.status === 'graded' ? <Badge tone="ok">Graded · {a.mine.marks}/{a.total}</Badge> : a.mine.status === 'submitted' ? <Badge tone="info">Submitted</Badge> : <Badge tone={overdue ? 'danger' : 'warn'}>{overdue ? 'Overdue' : 'To do'}</Badge>}
                </div>
                <div><h3 style={{ fontSize: 17 }}>{a.title}</h3><p className="muted" style={{ marginTop: 4, fontSize: 14 }}>{a.description}</p></div>
                <div className="row wrap muted" style={{ fontSize: 13, gap: 14 }}><span className="row" style={{ gap: 5 }}><Clock size={14} />{fmtDateTime(a.due)} · {relativeDay(a.due)}</span><span>{a.total} marks</span></div>
                {isTeacher ? (
                  <div><div className="row between" style={{ fontSize: 13, marginBottom: 6 }}><span className="muted">Submissions</span><b>{a.submitted}/{a.of}</b></div><Progress value={(a.submitted / a.of) * 100} /></div>
                ) : a.mine.status === 'pending' ? (
                  <button className="btn primary" onClick={() => setSubmitting(a)}><Upload /> Submit work</button>
                ) : <div className="row" style={{ color: 'var(--ok)', fontWeight: 700 }}><CheckCircle2 size={18} /> {a.mine.status === 'graded' ? 'Result published' : `Submitted ${a.mine.fileName ? `· ${a.mine.fileName}` : ''}`}</div>}
              </Card>
            );
          })}
        </div>
      )}

      {creating && (
        <Modal title="New assignment" onClose={() => setCreating(false)} footer={<><button className="btn ghost" onClick={() => setCreating(false)}>Cancel</button><button className="btn primary" onClick={create}>Publish</button></>}>
          <Field label="Course"><select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>{(courses.data || []).filter((c) => c.teacher.startsWith('Dr.')).map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}</select></Field>
          <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Refactoring exercise" /></Field>
          <Field label="Instructions"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="grid cols-2"><Field label="Total marks"><input type="number" min="1" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} /></Field><Field label="Due date & time"><input type="datetime-local" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></Field></div>
        </Modal>
      )}
      {submitting && (
        <Modal title={`Submit — ${submitting.title}`} onClose={() => setSubmitting(null)} footer={<><button className="btn ghost" onClick={() => setSubmitting(null)}>Cancel</button><button className="btn primary" onClick={submit}>Submit</button></>}>
          <label className="dropzone"><Upload /><div>{file ? <b>{file.name}</b> : <><b>Choose a file</b> to upload</>}</div><input type="file" hidden onChange={(e) => setFile(e.target.files[0])} /></label>
        </Modal>
      )}
    </>
  );
}

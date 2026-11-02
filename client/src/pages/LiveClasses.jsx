import { useState } from 'react';
import { Video, Plus, CalendarClock, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { listCourses } from '../services/courseService';
import { listLive, scheduleLive } from '../services/liveService';
import { Card, CardHead, Badge, PageHead, Modal, Field, Skeleton, Empty } from '../components/ui';
import { fmtDateTime, relativeDay } from '../utils/format';

export default function LiveClasses() {
  const { user } = useAuth();
  const toast = useToast();
  const isTeacher = user.role === 'teacher';
  const courses = useAsync(listCourses);
  const { data, loading, reload } = useAsync(listLive);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ courseId: 'c1', title: '', start: '', minutes: 60 });
  const code = (id) => courses.data?.find((c) => c.id === id)?.code;
  const live = (data || []).filter((l) => l.status === 'live');
  const next = (data || []).filter((l) => l.status === 'scheduled').sort((a, b) => new Date(a.start) - new Date(b.start));
  const past = (data || []).filter((l) => l.status === 'ended');

  const create = async () => {
    if (!f.title.trim() || !f.start) return toast('Title and start time are required', 'error');
    await scheduleLive({ ...f, minutes: Number(f.minutes), start: new Date(f.start).toISOString() });
    setOpen(false); setF({ ...f, title: '' }); reload(); toast('Live class scheduled — students notified');
  };

  const Row = ({ l }) => (
    <div className="list-item">
      <div className="file-ico" style={{ background: 'var(--brand-100)', color: 'var(--brand-700)' }}><Video /></div>
      <div className="grow"><b>{l.title}</b><small>{code(l.courseId)} · {relativeDay(l.start)} · {fmtDateTime(l.start)} · {l.minutes} min</small></div>
      {l.status === 'live' ? <a className="btn primary sm" href={l.link} onClick={(e) => { e.preventDefault(); toast('Joining the class room (simulated)'); }}><ExternalLink /> {isTeacher ? 'Start' : 'Join'} now</a>
        : l.status === 'scheduled' ? <Badge tone="info">Scheduled</Badge> : <Badge>Ended</Badge>}
    </div>
  );

  return (
    <>
      <PageHead title="Live Classes" subtitle="Schedule online sessions and join with one click." actions={isTeacher && <button className="btn primary" onClick={() => setOpen(true)}><Plus /> Schedule class</button>} />
      {loading ? <Skeleton n={2} /> : (
        <div className="stack">
          {live.length > 0 && <Card><CardHead title="Happening now" action={<span className="badge live">Live</span>} />{live.map((l) => <Row key={l.id} l={l} />)}</Card>}
          <Card><CardHead title="Upcoming" />{next.length ? next.map((l) => <Row key={l.id} l={l} />) : <Empty icon={CalendarClock} title="No upcoming classes" />}</Card>
          <Card><CardHead title="Past sessions" />{past.map((l) => <Row key={l.id} l={l} />)}</Card>
        </div>
      )}
      {open && (
        <Modal title="Schedule a live class" onClose={() => setOpen(false)} footer={<><button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn primary" onClick={create}>Schedule</button></>}>
          <Field label="Course"><select value={f.courseId} onChange={(e) => setF({ ...f, courseId: e.target.value })}>{(courses.data || []).filter((c) => c.teacher.startsWith('Dr.')).map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}</select></Field>
          <Field label="Topic"><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <div className="grid cols-2"><Field label="Start"><input type="datetime-local" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} /></Field><Field label="Minutes"><input type="number" min="15" step="15" value={f.minutes} onChange={(e) => setF({ ...f, minutes: e.target.value })} /></Field></div>
        </Modal>
      )}
    </>
  );
}

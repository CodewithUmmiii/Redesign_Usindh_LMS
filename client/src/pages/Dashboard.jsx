import { Link } from 'react-router-dom';
import { BookOpen, CalendarCheck, ClipboardList, Users, Video, ArrowRight, Award, Wallet, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { listCourses } from '../services/courseService';
import { listAssignments } from '../services/assignmentService';
import { listLive } from '../services/liveService';
import { listEvents } from '../services/miscService';
import { getMyResults } from '../services/resultService';
import { Card, CardHead, Stat, Badge, PageHead, Progress, Skeleton, Empty } from '../components/ui';
import { Ring } from '../components/charts';
import { fmtDateTime, fmtTime, relativeDay } from '../utils/format';
import { gpa } from '../utils/grading';

export default function Dashboard() {
  const { user } = useAuth();
  const courses = useAsync(listCourses);
  const assigns = useAsync(listAssignments);
  const live = useAsync(listLive);
  const events = useAsync(listEvents);
  const results = useAsync(getMyResults);

  const loading = courses.loading || assigns.loading || live.loading;
  const mine = (courses.data || []).filter((c) => (user.role === 'student' ? c.semester === 7 : user.role === 'teacher' ? c.teacher === user.name : true));
  const upcoming = (assigns.data || []).filter((a) => new Date(a.due) > new Date()).sort((a, b) => new Date(a.due) - new Date(b.due));
  const todayLive = (live.data || []).filter((l) => l.status !== 'ended').slice(0, 3);
  const nextEvents = (events.data || []).filter((e) => new Date(e.date) >= new Date(Date.now() - 864e5)).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  const students = mine.reduce((s, c) => s + c.students, 0);
  const avgProgress = mine.length ? mine.reduce((s, c) => s + (c.topics.filter((t) => t[1]).length / c.topics.length) * 100, 0) / mine.length : 0;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <PageHead title={`${greet}, ${user.name.split(' ').slice(0, 2).join(' ')}`} subtitle={`Here is what needs your attention today.`}
        actions={user.role === 'teacher' ? <><Link className="btn ghost" to="/attendance"><CalendarCheck /> Take attendance</Link><Link className="btn primary" to="/assignments"><ClipboardList /> New assignment</Link></> : user.role === 'student' ? <Link className="btn primary" to="/results"><Award /> My marksheet</Link> : null} />

      {loading ? <div className="grid cols-4"><Skeleton n={4} /></div> : (
        <div className="grid cols-4">
          <Stat icon={BookOpen} value={mine.length} label={user.role === 'admin' ? 'Active courses' : 'My courses'} />
          <Stat icon={Users} value={user.role === 'student' ? '4.0' : students} label={user.role === 'student' ? 'Latest GPA' : 'Students'} tone="blue" />
          <Stat icon={ClipboardList} value={upcoming.length} label="Open assignments" tone="gold" />
          <Stat icon={Video} value={todayLive.filter((l) => l.status === 'live').length} label="Live now" tone="red" />
        </div>
      )}

      <div className="grid sidebar-right" style={{ marginTop: 16 }}>
        <div className="stack">
          <Card>
            <CardHead title="Course progress" subtitle="Syllabus coverage — updated by the instructor" action={<Link to="/courses" className="btn sm ghost">All courses <ArrowRight /></Link>} />
            <div>
              {courses.loading ? <div style={{ padding: 20 }}><Skeleton n={2} /></div> : mine.slice(0, 4).map((c) => {
                const pct = (c.topics.filter((t) => t[1]).length / c.topics.length) * 100;
                return (
                  <Link key={c.id} to={`/courses/${c.id}`} className="list-item" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <Ring value={pct} size={52} stroke={6} color={c.color} />
                    <div className="grow"><b>{c.title}</b><small>{c.code} · {c.schedule}</small></div>
                    <div style={{ width: 130 }}><Progress value={pct} /></div>
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHead title="Upcoming deadlines" action={<Link to="/assignments" className="btn sm ghost">View all</Link>} />
            {upcoming.length === 0 ? <Empty icon={ClipboardList} title="Nothing due" hint="You're all caught up." /> : upcoming.slice(0, 4).map((a) => (
              <div className="list-item" key={a.id}>
                <div className="file-ico"><ClipboardList /></div>
                <div className="grow"><b>{a.title}</b><small>{(courses.data || []).find((c) => c.id === a.courseId)?.code} · {fmtDateTime(a.due)}</small></div>
                <Badge tone={new Date(a.due) - Date.now() < 2 * 864e5 ? 'danger' : 'info'}>{relativeDay(a.due)}</Badge>
              </div>
            ))}
          </Card>
        </div>

        <div className="stack">
          <Card>
            <CardHead title="Today & upcoming classes" />
            {todayLive.map((l) => (
              <div className="list-item" key={l.id}>
                <div className="file-ico" style={{ background: 'var(--brand-100)', color: 'var(--brand-700)' }}><Video /></div>
                <div className="grow"><b>{l.title}</b><small>{relativeDay(l.start)} · {fmtTime(l.start)}</small></div>
                {l.status === 'live' ? <Link to="/live" className="badge live">Live</Link> : <Badge>Scheduled</Badge>}
              </div>
            ))}
          </Card>

          <Card>
            <CardHead title="Calendar" action={<Link to="/calendar" className="btn sm ghost">Open</Link>} />
            {nextEvents.map((e) => (
              <div className="list-item" key={e.id} style={{ padding: '11px 20px' }}>
                <Clock size={16} className="muted" />
                <div className="grow"><b style={{ fontSize: 14 }}>{e.title}</b><small>{fmtDateTime(e.date)}</small></div>
                <Badge tone={e.type === 'exam' ? 'danger' : e.type === 'deadline' ? 'warn' : 'info'}>{e.type}</Badge>
              </div>
            ))}
          </Card>

          {user.role === 'student' && results.data && (
            <Card className="card-pad">
              <div className="row between"><div><small className="muted">Cumulative GPA (sample)</small><h3 style={{ fontSize: 30 }}>{gpa(results.data).toFixed(2)}</h3></div><TrendingUp color="var(--brand-600)" /></div>
              <div className="row" style={{ marginTop: 12 }}><Wallet size={16} className="muted" /><small className="muted">Fee status: no outstanding dues</small></div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

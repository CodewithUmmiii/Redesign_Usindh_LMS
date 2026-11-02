import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Clock, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { listCourses } from '../services/courseService';
import { Card, Badge, PageHead, Progress, Skeleton, Empty } from '../components/ui';

export default function Courses() {
  const { user } = useAuth();
  const { data, loading } = useAsync(listCourses);
  const [q, setQ] = useState('');
  const list = (data || [])
    .filter((c) => (user.role === 'student' ? c.semester === 7 : user.role === 'teacher' ? c.teacher === user.name : true))
    .filter((c) => `${c.title} ${c.code}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHead title="Courses" subtitle="Open a course to manage materials, track syllabus progress and post announcements."
        actions={<div className="search rel" style={{ width: 260 }}><Search /><input placeholder="Filter courses" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter courses" style={{ paddingLeft: 38 }} /></div>} />
      {loading ? <div className="grid cols-3"><Skeleton n={3} h={190} /></div> : list.length === 0 ? <Card><Empty title="No courses found" hint="Try a different search." /></Card> : (
        <div className="grid cols-3">
          {list.map((c) => {
            const done = c.topics.filter((t) => t[1]).length;
            const pct = (done / c.topics.length) * 100;
            return (
              <Link key={c.id} to={`/courses/${c.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                <Card hover>
                  <div className="course-banner" style={{ background: `linear-gradient(135deg, ${c.color}, color-mix(in srgb, ${c.color} 55%, #000))` }}>
                    <Badge tone="neutral">{c.code}</Badge>
                    <h3>{c.title}</h3>
                    <small>Semester {c.semester} · Section {c.section} · {c.credits} credits</small>
                  </div>
                  <div className="card-body stack" style={{ gap: 12 }}>
                    <div className="row between"><small className="muted">Syllabus progress</small><b>{done}/{c.topics.length} topics</b></div>
                    <Progress value={pct} />
                    <div className="row wrap muted" style={{ fontSize: 13, gap: 14 }}>
                      <span className="row" style={{ gap: 5 }}><Users size={14} />{c.students}</span>
                      <span className="row" style={{ gap: 5 }}><Clock size={14} />{c.schedule}</span>
                      <span className="row" style={{ gap: 5 }}><MapPin size={14} />{c.room}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

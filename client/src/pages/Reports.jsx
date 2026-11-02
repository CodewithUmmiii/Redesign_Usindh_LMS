import { useMemo, useState } from 'react';
import { Users, Award, CalendarCheck, AlertTriangle, Download } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { listCourses } from '../services/courseService';
import { getGradebook } from '../services/resultService';
import { Card, CardHead, PageHead, Stat, Badge, Progress, Skeleton } from '../components/ui';
import { BarChart, BarLabels, LineChart } from '../components/charts';
import { totalFor, gradeFor } from '../utils/grading';
import { downloadCsv } from '../utils/download';

export default function Reports() {
  const courses = useAsync(listCourses);
  const [courseId, setCourseId] = useState('c1');
  const gb = useAsync(() => getGradebook(courseId), [courseId]);
  const course = courses.data?.find((c) => c.id === courseId);

  const rows = useMemo(() => (gb.data ? gb.data.students.map((s) => { const t = totalFor(gb.data.marks[s.id], gb.data.distribution); return { ...s, total: t, g: gradeFor(t) }; }) : []), [gb.data]);
  const buckets = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map((g) => ({ label: g, value: rows.filter((r) => r.g.grade === g).length, color: g === 'F' ? 'var(--danger)' : undefined }));
  const atRisk = rows.filter((r) => r.attendance < 75 || r.total < 50);
  const avgAtt = rows.length ? Math.round(rows.reduce((s, r) => s + r.attendance, 0) / rows.length) : 0;
  const progress = course ? Math.round((course.topics.filter((t) => t[1]).length / course.topics.length) * 100) : 0;

  return (
    <>
      <PageHead title="Student performance reports" subtitle="Spot struggling students early and track course health."
        actions={<button className="btn ghost" onClick={() => downloadCsv(`report-${courseId}.csv`, [['Roll no', 'Name', 'Attendance %', 'Total', 'Grade'], ...rows.map((r) => [r.rollNo, r.name, r.attendance, r.total, r.g.grade])])}><Download /> Export CSV</button>} />
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <label className="field" style={{ maxWidth: 320 }}>Course<select value={courseId} onChange={(e) => setCourseId(e.target.value)}>{(courses.data || []).map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}</select></label>
      </div>
      {gb.loading ? <Skeleton n={3} /> : (<div className="stack">
        <div className="grid cols-4">
          <Stat icon={Users} value={rows.length} label="Students" /><Stat icon={CalendarCheck} value={`${avgAtt}%`} label="Avg attendance" tone="blue" />
          <Stat icon={Award} value={`${progress}%`} label="Syllabus covered" tone="gold" /><Stat icon={AlertTriangle} value={atRisk.length} label="At-risk students" tone="red" />
        </div>
        <div className="grid cols-2">
          <Card><CardHead title="Grade distribution" subtitle="Number of students per grade" /><div className="card-body"><BarChart data={buckets} /><BarLabels data={buckets} /></div></Card>
          <Card><CardHead title="Attendance trend" subtitle="Class average, last 6 sessions (sample)" /><div className="card-body"><LineChart points={[88, 91, 85, 89, 93, avgAtt]} labels={['S1', 'S2', 'S3', 'S4', 'S5', 'S6']} /></div></Card>
        </div>
        <Card>
          <CardHead title="Students needing attention" subtitle="Attendance below 75% or total below 50" />
          {atRisk.length === 0 ? <div className="empty">Nobody at risk 🎉</div> : atRisk.map((r) => (
            <div className="list-item" key={r.id}><div className="grow"><b>{r.name}</b><small>{r.rollNo}</small></div>
              <div style={{ width: 150 }}><Progress value={r.attendance} tone={r.attendance < 75 ? 'red' : ''} /></div><Badge tone={r.attendance < 75 ? 'danger' : 'ok'}>{r.attendance}% att.</Badge><Badge tone={r.total < 50 ? 'danger' : 'neutral'}>Total {r.total}</Badge></div>
          ))}
        </Card>
      </div>)}
    </>
  );
}

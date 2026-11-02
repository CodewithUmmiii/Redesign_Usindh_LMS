import { useEffect, useState } from 'react';
import { Plus, Timer, Wand2, Trash2, Play, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { listCourses } from '../services/courseService';
import { listQuizzes, createQuiz, publishQuiz, submitQuiz, questionBank } from '../services/quizService';
import { Card, Badge, PageHead, Modal, Field, Skeleton } from '../components/ui';
import { fmtDateTime } from '../utils/format';

const blankQ = () => ({ q: '', options: ['', '', '', ''], answer: 0 });

function Builder({ courses, onClose, onSaved }) {
  const toast = useToast();
  const [meta, setMeta] = useState({ courseId: 'c1', title: '', duration: 15 });
  const [qs, setQs] = useState([blankQ()]);
  const patch = (i, p) => setQs(qs.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const quick = async () => { const bank = await questionBank(); setQs([...bank].sort(() => Math.random() - 0.5).slice(0, 4)); toast('4 questions picked from the question bank'); };
  const save = async (publish) => {
    const valid = qs.filter((x) => x.q.trim() && x.options.every((o) => o.trim()));
    if (!meta.title.trim() || !valid.length) return toast('Add a title and at least one complete question', 'error');
    await createQuiz({ ...meta, duration: Number(meta.duration), questions: valid, status: publish ? 'published' : 'draft', opens: new Date().toISOString(), mine: { status: publish ? 'available' : 'upcoming' } });
    onSaved(); toast(publish ? 'Quiz published' : 'Draft saved');
  };
  return (
    <Modal wide title="Quiz builder" onClose={onClose} footer={<><button className="btn ghost" onClick={() => save(false)}>Save draft</button><button className="btn primary" onClick={() => save(true)}><Send /> Publish</button></>}>
      <div className="grid cols-3"><Field label="Course"><select value={meta.courseId} onChange={(e) => setMeta({ ...meta, courseId: e.target.value })}>{courses.filter((c) => c.teacher.startsWith('Dr.')).map((c) => <option key={c.id} value={c.id}>{c.code}</option>)}</select></Field>
        <Field label="Title"><input value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} /></Field>
        <Field label="Duration (min)"><input type="number" min="1" value={meta.duration} onChange={(e) => setMeta({ ...meta, duration: e.target.value })} /></Field></div>
      <div className="row between"><b>Questions ({qs.length})</b><div className="row"><button className="btn sm gold" onClick={quick}><Wand2 /> Quick-build from question bank</button><button className="btn sm ghost" onClick={() => setQs([...qs, blankQ()])}><Plus /> Add question</button></div></div>
      {qs.map((x, i) => (
        <Card key={i} className="card-pad stack" style={{ gap: 10 }}>
          <div className="row"><b>Q{i + 1}</b><input placeholder="Question text" value={x.q} onChange={(e) => patch(i, { q: e.target.value })} />{qs.length > 1 && <button className="icon-btn" aria-label="Remove question" onClick={() => setQs(qs.filter((_, j) => j !== i))}><Trash2 size={16} /></button>}</div>
          {x.options.map((o, k) => (
            <div className="row" key={k}><input type="radio" style={{ width: 18 }} name={`ans${i}`} checked={x.answer === k} onChange={() => patch(i, { answer: k })} aria-label={`Mark option ${k + 1} correct`} />
              <input placeholder={`Option ${k + 1}`} value={o} onChange={(e) => patch(i, { options: x.options.map((v, j) => (j === k ? e.target.value : v)) })} /></div>
          ))}
        </Card>
      ))}
    </Modal>
  );
}

function Attempt({ quiz, onDone, onClose }) {
  const toast = useToast();
  const [ans, setAns] = useState({});
  const [left, setLeft] = useState(quiz.duration * 60);
  const [result, setResult] = useState(null);
  const finish = async () => {
    if (result) return;
    const score = quiz.questions.reduce((s, q, i) => s + (ans[i] === q.answer ? 1 : 0), 0);
    setResult(score); await submitQuiz(quiz.id, score); onDone(); toast('Quiz submitted');
  };
  useEffect(() => { const t = setInterval(() => setLeft((s) => s - 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (left <= 0) finish(); }, [left]); // eslint-disable-line react-hooks/exhaustive-deps
  const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, '0'); const ss = String(Math.max(left, 0) % 60).padStart(2, '0');
  return (
    <Modal wide title={quiz.title} onClose={onClose} footer={result === null ? <button className="btn primary" onClick={finish}><Send /> Submit quiz</button> : <button className="btn primary" onClick={onClose}>Close</button>}>
      {result !== null ? (
        <div className="empty"><CheckCircle2 color="var(--ok)" /><h3>Score: {result} / {quiz.questions.length}</h3><span>Your result has been recorded.</span></div>
      ) : (<>
        <div className="row between"><Badge tone="info">{quiz.questions.length} questions</Badge><Badge tone={left < 60 ? 'danger' : 'warn'}><Timer size={13} /> {mm}:{ss}</Badge></div>
        {quiz.questions.map((q, i) => (
          <Card key={i} className="card-pad stack" style={{ gap: 8 }}><b>{i + 1}. {q.q}</b>
            {q.options.map((o, k) => <label key={k} className="row" style={{ padding: '8px 10px', borderRadius: 8, background: ans[i] === k ? 'var(--brand-50)' : 'transparent', cursor: 'pointer' }}><input type="radio" style={{ width: 18 }} name={`q${i}`} checked={ans[i] === k} onChange={() => setAns({ ...ans, [i]: k })} />{o}</label>)}
          </Card>
        ))}
      </>)}
    </Modal>
  );
}

export default function Quizzes() {
  const { user } = useAuth();
  const toast = useToast();
  const isTeacher = user.role === 'teacher';
  const courses = useAsync(listCourses);
  const { data, loading, reload } = useAsync(listQuizzes);
  const [building, setBuilding] = useState(false);
  const [taking, setTaking] = useState(null);
  const code = (id) => courses.data?.find((c) => c.id === id)?.code;

  return (
    <>
      <PageHead title="Quizzes & Exams" subtitle={isTeacher ? 'Build timed quizzes, publish them and review attempts.' : 'Take timed quizzes and see your scores.'}
        actions={isTeacher && <button className="btn primary" onClick={() => setBuilding(true)}><Plus /> New quiz</button>} />
      {loading ? <Skeleton n={3} /> : (
        <div className="grid cols-3">
          {(data || []).filter((q) => isTeacher || q.status !== 'draft').map((q) => (
            <Card key={q.id} className="card-pad stack" style={{ gap: 12 }}>
              <div className="row between"><Badge tone="info">{code(q.courseId)}</Badge><Badge tone={q.status === 'published' ? 'ok' : q.status === 'draft' ? 'warn' : 'neutral'}>{q.status}</Badge></div>
              <h3 style={{ fontSize: 17 }}>{q.title}</h3>
              <div className="row wrap muted" style={{ fontSize: 13, gap: 14 }}><span className="row" style={{ gap: 5 }}><Timer size={14} />{q.duration} min</span><span>{q.questions.length} questions</span><span>{fmtDateTime(q.opens)}</span></div>
              {isTeacher ? (
                <div className="row between"><small className="muted">{q.attempts} attempts{q.avg ? ` · avg ${q.avg}` : ''}</small>
                  {q.status === 'draft' && <button className="btn sm primary" onClick={async () => { await publishQuiz(q.id); reload(); toast('Quiz published'); }}>Publish</button>}</div>
              ) : q.mine.status === 'available' ? <button className="btn primary" onClick={() => setTaking(q)}><Play /> Start quiz</button>
                : q.mine.status === 'done' ? <Badge tone="ok">Completed · {q.mine.score}/{q.questions.length}</Badge> : <Badge>Opens {fmtDateTime(q.opens)}</Badge>}
            </Card>
          ))}
        </div>
      )}
      {building && <Builder courses={courses.data || []} onClose={() => setBuilding(false)} onSaved={() => { setBuilding(false); reload(); }} />}
      {taking && <Attempt quiz={taking} onDone={reload} onClose={() => setTaking(null)} />}
    </>
  );
}

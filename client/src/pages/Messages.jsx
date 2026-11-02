import { useEffect, useRef, useState } from 'react';
import { Send, Megaphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { listThreads, sendMessage } from '../services/messageService';
import { listCourses, postAnnouncement } from '../services/courseService';
import { Card, PageHead, Avatar, Tabs, Field, Skeleton } from '../components/ui';
import { fmtDateTime } from '../utils/format';

export default function Messages() {
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, setData } = useAsync(listThreads);
  const courses = useAsync(listCourses);
  const [tab, setTab] = useState('inbox');
  const [sel, setSel] = useState('t1');
  const [text, setText] = useState('');
  const [a, setA] = useState({ courseId: 'c1', title: '', body: '' });
  const end = useRef(null);
  const thread = (data || []).find((t) => t.id === sel);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [thread?.messages.length, sel]);

  const send = async (e) => {
    e.preventDefault(); if (!text.trim()) return;
    const next = await sendMessage(sel, text.trim()); setData(next); setText('');
  };
  const broadcast = async () => {
    if (!a.title.trim()) return toast('Add a title', 'error');
    await postAnnouncement(a); setA({ ...a, title: '', body: '' }); toast('Announcement sent to all students in the course');
  };

  return (
    <>
      <PageHead title="Messages" subtitle="Direct messages and class-wide announcements in one place." />
      <Tabs value={tab} onChange={setTab} tabs={[{ value: 'inbox', label: 'Inbox' }, ...(user.role !== 'student' ? [{ value: 'announce', label: 'Announcements' }] : [])]} />
      {tab === 'inbox' && (loading ? <Skeleton n={2} h={200} /> : (
        <Card className="chat">
          <div className="chat-list">
            {data.map((t) => (
              <button key={t.id} className={`chat-item ${sel === t.id ? 'on' : ''}`} onClick={() => setSel(t.id)}>
                <Avatar name={t.with} /><div><b>{t.with}</b><small>{t.messages[t.messages.length - 1].text.slice(0, 38)}…</small></div>
              </button>
            ))}
          </div>
          <div className="chat-pane">
            <div className="chat-title"><Avatar name={thread.with} /><div><b>{thread.with}</b><br /><small className="muted">{thread.role}</small></div></div>
            <div className="chat-body">
              {thread.messages.map((m, i) => <div key={i} className={`bubble ${m.from}`}>{m.text}<small>{fmtDateTime(m.at)}</small></div>)}
              <div ref={end} />
            </div>
            <form className="chat-input" onSubmit={send}><input placeholder="Write a message…" value={text} onChange={(e) => setText(e.target.value)} aria-label="Message" /><button className="btn primary" aria-label="Send"><Send /></button></form>
          </div>
        </Card>
      ))}
      {tab === 'announce' && (
        <Card className="card-pad stack" style={{ maxWidth: 640 }}>
          <h3>Broadcast to a course</h3>
          <Field label="Course"><select value={a.courseId} onChange={(e) => setA({ ...a, courseId: e.target.value })}>{(courses.data || []).map((c) => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}</select></Field>
          <Field label="Title"><input value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} /></Field>
          <Field label="Message"><textarea value={a.body} onChange={(e) => setA({ ...a, body: e.target.value })} /></Field>
          <button className="btn primary" onClick={broadcast}><Megaphone /> Send announcement</button>
        </Card>
      )}
    </>
  );
}

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { listEvents, addEvent } from '../services/miscService';
import { Card, CardHead, Badge, PageHead, Modal, Field, Empty } from '../components/ui';
import { fmtTime } from '../utils/format';

const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const TONE = { class: 'info', deadline: 'warn', exam: 'danger', event: 'neutral' };

export default function Calendar() {
  const { user } = useAuth();
  const toast = useToast();
  const { data, reload } = useAsync(listEvents);
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selected, setSelected] = useState(key(new Date()));
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ title: '', type: 'event', date: '' });

  const byDay = useMemo(() => (data || []).reduce((m, e) => { const k = key(new Date(e.date)); (m[k] ||= []).push(e); return m; }, {}), [data]);
  const first = new Date(cursor); const startPad = (first.getDay() + 6) % 7;
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: days }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1))];
  const move = (n) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));
  const today = key(new Date());

  const add = async () => {
    if (!f.title.trim() || !f.date) return toast('Title and date are required', 'error');
    await addEvent({ ...f, date: new Date(f.date).toISOString() }); setAdding(false); setF({ title: '', type: 'event', date: '' }); reload(); toast('Added to calendar');
  };

  return (
    <>
      <PageHead title="Course Calendar" subtitle="Classes, deadlines and exams together." actions={user.role !== 'student' && <button className="btn primary" onClick={() => setAdding(true)}><Plus /> Add event</button>} />
      <div className="grid sidebar-right">
        <Card>
          <div className="card-head"><h3>{cursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
            <div className="row"><button className="icon-btn" onClick={() => move(-1)} aria-label="Previous month"><ChevronLeft size={18} /></button><button className="btn sm ghost" onClick={() => { const d = new Date(); d.setDate(1); setCursor(d); setSelected(today); }}>Today</button><button className="icon-btn" onClick={() => move(1)} aria-label="Next month"><ChevronRight size={18} /></button></div></div>
          <div className="cal">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="cal-dow">{d}</div>)}
            {cells.map((d, i) => d ? (
              <button key={i} className={`cal-cell ${key(d) === today ? 'today' : ''} ${key(d) === selected ? 'sel' : ''}`} onClick={() => setSelected(key(d))}>
                <span>{d.getDate()}</span>
                <div className="dots">{(byDay[key(d)] || []).slice(0, 3).map((e) => <i key={e.id} className={`dot-${e.type}`} />)}</div>
              </button>
            ) : <div key={i} />)}
          </div>
        </Card>
        <Card>
          <CardHead title={new Date(selected).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} />
          {(byDay[selected] || []).length === 0 ? <Empty title="Nothing scheduled" hint="Pick another day." /> : byDay[selected].map((e) => (
            <div className="list-item" key={e.id}><div className="grow"><b>{e.title}</b><small>{fmtTime(e.date)}</small></div><Badge tone={TONE[e.type]}>{e.type}</Badge></div>
          ))}
          <div className="row wrap" style={{ padding: 16, gap: 8 }}>{Object.entries(TONE).map(([k, t]) => <Badge key={k} tone={t}>{k}</Badge>)}</div>
        </Card>
      </div>
      {adding && (
        <Modal title="Add calendar event" onClose={() => setAdding(false)} footer={<><button className="btn ghost" onClick={() => setAdding(false)}>Cancel</button><button className="btn primary" onClick={add}>Add</button></>}>
          <Field label="Title"><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <div className="grid cols-2"><Field label="Type"><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{Object.keys(TONE).map((t) => <option key={t}>{t}</option>)}</select></Field>
            <Field label="Date & time"><input type="datetime-local" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field></div>
        </Modal>
      )}
    </>
  );
}

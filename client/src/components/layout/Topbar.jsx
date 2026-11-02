import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NAV } from '../../config/nav';
import { Avatar } from '../ui';
import { listNotifications, markAllRead } from '../../services/messageService';
import { fmtDateTime } from '../../utils/format';

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null); // 'notif' | 'user' | 'search'
  const [notes, setNotes] = useState([]);
  const ref = useRef(null);

  useEffect(() => { listNotifications().then(setNotes); }, []);
  useEffect(() => {
    const off = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, []);

  const pages = useMemo(() => NAV.flatMap((g) => g.items).filter((i) => i.roles.includes(user.role)), [user.role]);
  const hits = q.trim() ? pages.filter((p) => p.label.toLowerCase().includes(q.toLowerCase())) : [];
  const unread = notes.filter((n) => n.unread).length;

  return (
    <header className="topbar" ref={ref}>
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu"><Menu size={19} /></button>
      <div className="search rel">
        <Search />
        <input placeholder="Search pages…  (e.g. attendance, results)" value={q} onChange={(e) => { setQ(e.target.value); setOpen('search'); }} aria-label="Search pages" />
        {open === 'search' && hits.length > 0 && (
          <div className="pop" style={{ left: 0, right: 'auto', width: '100%' }}>
            {hits.map((h) => (
              <button key={h.to} className="pop-item" style={{ textAlign: 'left', background: 'none', border: 0, cursor: 'pointer', width: '100%' }} onClick={() => { navigate(h.to); setQ(''); setOpen(null); }}>
                <b>{h.label}</b><small>Go to page</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="spacer" />
      <button className="icon-btn" onClick={toggle} aria-label="Toggle dark mode">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
      <div className="rel">
        <button className="icon-btn" onClick={() => setOpen(open === 'notif' ? null : 'notif')} aria-label={`Notifications, ${unread} unread`}>
          <Bell size={18} />{unread > 0 && <span className="dot">{unread}</span>}
        </button>
        {open === 'notif' && (
          <div className="pop">
            <div className="pop-head">Notifications <button className="btn sm ghost" onClick={() => markAllRead().then(setNotes)}>Mark all read</button></div>
            {notes.map((n) => (
              <div key={n.id} className={`pop-item ${n.unread ? 'unread' : ''}`}><b>{n.title}</b><span>{n.detail}</span><small>{fmtDateTime(n.at)}</small></div>
            ))}
          </div>
        )}
      </div>
      <div className="rel">
        <button className="user-chip" onClick={() => setOpen(open === 'user' ? null : 'user')} aria-haspopup="menu">
          <Avatar name={user.name} size="sm" />
          <div><b>{user.name}</b><small>{user.role}</small></div>
        </button>
        {open === 'user' && (
          <div className="pop" style={{ width: 230 }}>
            <button className="pop-item" style={{ background: 'none', border: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => { navigate('/profile'); setOpen(null); }}><b>My profile</b><small>{user.email}</small></button>
            <button className="pop-item" style={{ background: 'none', border: 0, cursor: 'pointer', textAlign: 'left', color: 'var(--danger)' }} onClick={() => { logout(); navigate('/login'); }}><b><LogOut size={14} style={{ verticalAlign: -2 }} /> Sign out</b></button>
          </div>
        )}
      </div>
    </header>
  );
}

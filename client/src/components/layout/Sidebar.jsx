import { NavLink } from 'react-router-dom';
import { NAV } from '../../config/nav';
import { UNIVERSITY } from '../../config/env';
import { Logo } from '../ui/Brand';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand">
        <Logo />
        <div><h1>{UNIVERSITY.name}</h1><p>{UNIVERSITY.city} · {UNIVERSITY.portal}</p></div>
      </div>
      {NAV.map((g) => {
        const items = g.items.filter((i) => i.roles.includes(user.role));
        if (!items.length) return null;
        return (
          <div className="nav-group" key={g.group}>
            <h4>{g.group}</h4>
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onNavigate}>
                <Icon /> {label}
              </NavLink>
            ))}
          </div>
        );
      })}
      <div className="sidebar-foot">Reengineered frontend prototype<br />Software Reengineering · MERN</div>
    </aside>
  );
}

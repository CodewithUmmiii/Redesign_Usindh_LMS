import { useEffect } from 'react';
import { X, Inbox } from 'lucide-react';
import { initials } from '../../utils/format';

export const Card = ({ children, className = '', hover }) => <div className={`card ${hover ? 'hover' : ''} ${className}`}>{children}</div>;

export const CardHead = ({ title, subtitle, action }) => (
  <div className="card-head">
    <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
    {action}
  </div>
);

export const Badge = ({ tone = 'neutral', children }) => <span className={`badge ${tone}`}>{children}</span>;

export const Avatar = ({ name, size = '' }) => <span className={`avatar ${size}`} aria-hidden="true">{initials(name)}</span>;

export const Progress = ({ value, tone = '' }) => (
  <div className={`progress ${tone}`} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
    <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

export const Stat = ({ icon: Icon, value, label, tone = 'green' }) => (
  <Card className="stat">
    <div className={`ico tone-${tone}`}><Icon /></div>
    <div><b>{value}</b><span>{label}</span></div>
  </Card>
);

export const Empty = ({ icon: Icon = Inbox, title, hint }) => (
  <div className="empty"><Icon /><b>{title}</b>{hint && <span>{hint}</span>}</div>
);

export const Skeleton = ({ h = 90, n = 1 }) => (
  <>{Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton" style={{ minHeight: h }} />)}</>
);

export function PageHead({ title, subtitle, crumbs, actions }) {
  return (
    <div className="page-head">
      <div>
        {crumbs && <div className="crumbs">{crumbs}</div>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="row wrap">{actions}</div>}
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.value} role="tab" aria-selected={value === t.value} className={value === t.value ? 'on' : ''} onClick={() => onChange(t.value)}>{t.label}</button>
      ))}
    </div>
  );
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="seg" role="group">
      {options.map((o) => <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>)}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export const Field = ({ label, children }) => <label className="field">{label}{children}</label>;

export const Toggle = ({ checked, onChange, label }) => (
  <span className="toggle"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} /><i /></span>
);

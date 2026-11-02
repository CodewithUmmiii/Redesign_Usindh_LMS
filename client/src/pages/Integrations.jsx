import { GraduationCap, Wallet, Mail, Library, FileCheck2, CalendarCheck, Bus, Plug } from 'lucide-react';

const ICONS = { GraduationCap, Wallet, Mail, Library, FileCheck2, CalendarCheck, Bus };
import { useToast } from '../context/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { listIntegrations } from '../services/miscService';
import { Card, Badge, PageHead, Skeleton } from '../components/ui';

export default function Integrations() {
  const toast = useToast();
  const { data, loading } = useAsync(listIntegrations);
  return (
    <>
      <PageHead title="Linked services" subtitle="University systems connected to the LMS so you don't have to sign in everywhere." />
      {loading ? <div className="grid cols-3"><Skeleton n={6} h={150} /></div> : (
        <div className="grid cols-3">
          {data.map((s) => {
            const Icon = ICONS[s.icon] || Plug;
            const planned = s.status === 'planned';
            return (
              <Card key={s.id} hover className="card-pad stack" style={{ gap: 12 }}>
                <div className="row between"><div className="stat"><div className={`ico ${planned ? 'tone-gold' : 'tone-green'}`} style={{ padding: 0 }}><Icon /></div></div><Badge tone={planned ? 'warn' : 'ok'}>{planned ? 'Planned' : 'Connected'}</Badge></div>
                <div><h3 style={{ fontSize: 16 }}>{s.name}</h3><p className="muted" style={{ fontSize: 13.5 }}>{s.desc}</p></div>
                <small className="muted">{s.stat}</small>
                <button className="btn ghost sm" disabled={planned} onClick={() => toast(`Opening ${s.name} (simulated single sign-on)`)}>{planned ? 'Coming soon' : 'Open service'}</button>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

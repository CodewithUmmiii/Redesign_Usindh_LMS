import { Link } from 'react-router-dom';
import { Info, ArrowUpRight } from 'lucide-react';
import { SURVEY } from '../data/mock';
import { Card, CardHead, PageHead, Badge } from '../components/ui';

const QUESTIONS = [
  ['Frequency of use', 'frequency'], ['Ease of use', 'ease'], ['Navigation', 'navigation'], ['Learnability', 'learn'], ['Interface / design', 'design'],
  ['Satisfaction', 'satisfaction'], ['Want reengineered LMS?', 'prefer'], ['Performance', 'speed'], ['Errors / crashes', 'errors'], ['Reliability', 'reliability'],
  ['Mobile experience', 'mobile'], ['Security / privacy', 'security'], ['Integration importance', 'integration'],
];
const tone = (v) => (/difficult|unreliable|sometimes|slightly/i.test(v) ? 'warn' : /easy|good|excellent|yes|rarely/i.test(v) ? 'ok' : 'neutral');

export default function SurveyInsights() {
  const [r1, r2] = SURVEY.respondents;
  return (
    <>
      <PageHead title="Survey insights" subtitle="What faculty told us about the current LMS, and how each finding shaped this redesign." />
      <Card className="card-pad row" style={{ gap: 12, background: 'var(--gold-100)', borderColor: 'transparent', marginBottom: 16, alignItems: 'flex-start' }}>
        <Info color="#8a6212" style={{ flex: 'none', marginTop: 2 }} />
        <p style={{ fontSize: 14 }}><b>Small sample:</b> 2 teachers responded ({r1.designation} and {r2.designation}). Answers were transcribed from handwritten forms; where a tick was ambiguous it is noted. Treat these as directional, not statistical.</p>
      </Card>

      <div className="stack">
        <Card>
          <CardHead title="Responses side by side" />
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Question</th><th>{r1.label}<br /><span style={{ fontWeight: 500, textTransform: 'none' }}>{r1.designation}</span></th><th>{r2.label}<br /><span style={{ fontWeight: 500, textTransform: 'none' }}>{r2.designation}</span></th></tr></thead>
            <tbody>{QUESTIONS.map(([label, k]) => <tr key={k}><td><b>{label}</b></td><td><Badge tone={tone(r1[k])}>{r1[k]}</Badge></td><td><Badge tone={tone(r2[k])}>{r2[k]}</Badge></td></tr>)}</tbody></table></div>
        </Card>

        <div className="grid cols-2">
          {[r1, r2].map((r) => (
            <Card key={r.id} className="card-pad stack" style={{ gap: 12 }}>
              <h3>{r.label} — open answers</h3>
              {[['Functions in use', r.using.join(', ')], ['Functions causing problems', r.problems.join(', ')], ['New features wanted', r.wants.join(', ')], ['Systems to integrate', r.integrate.join(', ')],
                ['Missing function', r.missing], ['Improve the most', r.improve], ['Biggest problem', r.biggest], ['One feature wanted', r.oneFeature], ['Do NOT change', r.keep]].map(([k, v]) => (
                <div key={k}><small className="muted" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{k}</small><p style={{ fontSize: 14 }}>{v}</p></div>
              ))}
            </Card>
          ))}
        </div>

        <Card>
          <CardHead title="From feedback to design decisions" subtitle="Traceability matrix — every major screen maps back to a survey finding" />
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Finding</th><th>Survey Q</th><th>Design decision</th><th>Where</th></tr></thead>
            <tbody>{SURVEY.traceability.map((t) => (
              <tr key={t.finding}><td style={{ maxWidth: 360 }}>{t.finding}</td><td><Badge tone="info">{t.source}</Badge></td><td style={{ maxWidth: 360 }}>{t.decision}</td><td><Link className="btn sm ghost" to={t.route}>{t.where} <ArrowUpRight /></Link></td></tr>
            ))}</tbody></table></div>
        </Card>
      </div>
    </>
  );
}

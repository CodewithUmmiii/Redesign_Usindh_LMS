// Dependency-free SVG charts (keeps the bundle small and works offline).

export function BarChart({ data, height = 190, color = 'var(--brand-600)', max }) {
  const top = max ?? Math.max(1, ...data.map((d) => d.value));
  const w = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 ${height / 2}`} preserveAspectRatio="none" style={{ width: '100%', height }} role="img" aria-label="Bar chart">
      {[0.25, 0.5, 0.75, 1].map((g) => <line key={g} x1="0" x2="100" y1={(height / 2) * (1 - g) - 6} y2={(height / 2) * (1 - g) - 6} stroke="var(--border)" strokeWidth="0.3" />)}
      {data.map((d, i) => {
        const h = (d.value / top) * (height / 2 - 14);
        return <rect key={d.label} x={i * w + w * 0.2} y={height / 2 - 6 - h} width={w * 0.6} height={Math.max(h, 0.5)} rx="1.2" fill={d.color || color}><title>{`${d.label}: ${d.value}`}</title></rect>;
      })}
    </svg>
  );
}

export function BarLabels({ data }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, textAlign: 'center', fontSize: 12, color: 'var(--text-3)', fontWeight: 700 }}>
      {data.map((d) => <span key={d.label}>{d.label}<br /><b style={{ color: 'var(--text)' }}>{d.value}</b></span>)}
    </div>
  );
}

export function LineChart({ points, height = 170, color = 'var(--brand-600)', labels = [] }) {
  const W = 300; const H = height / 1.6; const pad = 8;
  const max = Math.max(...points, 100); const min = Math.min(...points, 0);
  const x = (i) => pad + (i * (W - pad * 2)) / Math.max(points.length - 1, 1);
  const y = (v) => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p)}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height }} role="img" aria-label="Line chart">
        <defs><linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".25" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
        {[0, 25, 50, 75, 100].map((g) => <line key={g} x1={pad} x2={W - pad} y1={y(g)} y2={y(g)} stroke="var(--border)" strokeWidth=".6" />)}
        <path d={`${line} L${x(points.length - 1)},${H - pad} L${x(0)},${H - pad} Z`} fill="url(#lg)" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => <circle key={i} cx={x(i)} cy={y(p)} r="3" fill="var(--surface)" stroke={color} strokeWidth="2"><title>{`${labels[i] || i + 1}: ${p}%`}</title></circle>)}
      </svg>
      {labels.length > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)', fontWeight: 700, padding: '0 4px' }}>{labels.map((l) => <span key={l}>{l}</span>)}</div>}
    </div>
  );
}

export function Ring({ value, size = 64, stroke = 7, color = 'var(--brand-600)', label }) {
  const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} role="img" aria-label={`${Math.round(value)} percent`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--brand-100)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: 'stroke-dashoffset .5s' }} />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: size / 4.4 }}>{label ?? `${Math.round(value)}%`}</span>
    </div>
  );
}

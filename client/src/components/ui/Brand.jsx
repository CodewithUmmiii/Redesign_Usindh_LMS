import { useState } from 'react';
import { LOGO_URL, UNIVERSITY } from '../../config/env';

/**
 * The official logo is hotlinked from the university website (set VITE_LOGO_URL, or drop a file in
 * /public and point the variable at it). A monogram always sits underneath, so a blocked, slow or
 * missing image never shows a broken-image icon.
 */
export function Logo({ size = 46 }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="brand-logo" style={{ width: size, height: size, position: 'relative' }}>
      {!loaded && <span className="mono" style={{ fontSize: size * 0.4 }}>US</span>}
      <img
        src={LOGO_URL}
        alt={loaded ? `${UNIVERSITY.name} logo` : ''}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        referrerPolicy="no-referrer"
        style={{ position: 'absolute', inset: 0, opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}

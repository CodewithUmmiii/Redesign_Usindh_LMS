import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const ThemeContext = createContext(null);
const read = () => { try { return localStorage.getItem('usindh-theme') || 'light'; } catch { return 'light'; } };

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('usindh-theme', theme); } catch { /* ignore */ }
  }, [theme]);
  const value = useMemo(() => ({ theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);

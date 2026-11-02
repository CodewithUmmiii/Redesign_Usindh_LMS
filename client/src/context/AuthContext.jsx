import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import * as auth from '../services/authService';

const AuthContext = createContext(null);
const KEY = 'usindh-user';

const readUser = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const persist = (u) => { try { u ? localStorage.setItem(KEY, JSON.stringify(u)) : localStorage.removeItem(KEY); } catch { /* ignore */ } };

  const login = useCallback(async (creds) => {
    const { token, user: u } = await auth.login(creds);
    try { localStorage.setItem('usindh-token', token); } catch { /* ignore */ }
    persist(u); setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => { persist(null); setUser(null); }, []);

  const saveProfile = useCallback(async (next) => {
    const saved = await auth.updateProfile(next);
    persist(saved); setUser(saved);
    return saved;
  }, []);

  const value = useMemo(() => ({ user, login, logout, saveProfile }), [user, login, logout, saveProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

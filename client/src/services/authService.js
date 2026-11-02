import { USE_MOCK, request, mock } from './client';
import { db } from './mockDb';

export const login = ({ role, email, password }) =>
  USE_MOCK
    ? mock(() => {
        const profiles = db.get('profiles');
        return { token: 'demo-token', user: profiles[role] };
      })
    : request('/auth/login', { method: 'POST', body: { role, email, password } });

export const updateProfile = (user) =>
  USE_MOCK
    ? mock(() => { db.update('profiles', (p) => ({ ...p, [user.role]: user })); return user; }, 150)
    : request('/me', { method: 'PUT', body: user });

import { USE_MOCK, request, mock } from './client';
import { db } from './mockDb';

export const listEvents = () => (USE_MOCK ? mock(() => db.get('events')) : request('/events'));
export const addEvent = (e) =>
  USE_MOCK ? mock(() => { const item = { id: `e${Date.now()}`, ...e }; db.update('events', (l) => [...l, item]); return item; }, 150) : request('/events', { method: 'POST', body: e });
export const listIntegrations = () => (USE_MOCK ? mock(() => db.get('integrations')) : request('/integrations'));
export const resetDemoData = () => { db.reset(); };

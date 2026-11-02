import { USE_MOCK, request, mock } from './client';
import { db } from './mockDb';

export const listLive = () => (USE_MOCK ? mock(() => db.get('live')) : request('/live'));
export const scheduleLive = (l) =>
  USE_MOCK ? mock(() => { const item = { id: `l${Date.now()}`, link: '#', status: 'scheduled', ...l }; db.update('live', (x) => [item, ...x]); return item; }, 250) : request('/live', { method: 'POST', body: l });

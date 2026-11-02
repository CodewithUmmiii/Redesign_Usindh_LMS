import { USE_MOCK, request, mock } from './client';
import { db } from './mockDb';

export const listAssignments = () => (USE_MOCK ? mock(() => db.get('assignments')) : request('/assignments'));
export const createAssignment = (a) =>
  USE_MOCK ? mock(() => { const item = { id: `a${Date.now()}`, submitted: 0, of: 40, mine: { status: 'pending' }, ...a }; db.update('assignments', (l) => [item, ...l]); return item; }, 250) : request('/assignments', { method: 'POST', body: a });
export const submitAssignment = (id, fileName) =>
  USE_MOCK ? mock(() => db.update('assignments', (l) => l.map((a) => (a.id === id ? { ...a, submitted: a.submitted + 1, mine: { status: 'submitted', fileName } } : a))), 350) : request(`/assignments/${id}/submit`, { method: 'POST', body: { fileName } });

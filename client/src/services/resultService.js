import { USE_MOCK, request, mock } from './client';
import { db } from './mockDb';

export const getGradebook = (courseId) =>
  USE_MOCK ? mock(() => ({ distribution: db.get('distribution')[courseId], marks: db.get('marks')[courseId], students: db.get('students') })) : request(`/results/gradebook?course=${courseId}`);

export const saveGradebook = (courseId, { distribution, marks }) =>
  USE_MOCK ? mock(() => { db.update('distribution', (d) => ({ ...d, [courseId]: distribution })); db.update('marks', (m) => ({ ...m, [courseId]: marks })); return true; }, 400) : request(`/results/gradebook?course=${courseId}`, { method: 'PUT', body: { distribution, marks } });

export const getMyResults = () => (USE_MOCK ? mock(() => db.get('studentResults')) : request('/results/me'));

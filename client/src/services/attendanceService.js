import { USE_MOCK, request, mock } from './client';
import { db } from './mockDb';

export const getSheet = (courseId, date) =>
  USE_MOCK ? mock(() => db.get('attendance')[`${courseId}|${date}`] || null, 150) : request(`/attendance?course=${courseId}&date=${date}`);

export const saveSheet = (courseId, date, marks) =>
  USE_MOCK ? mock(() => { db.update('attendance', (a) => ({ ...a, [`${courseId}|${date}`]: marks })); return true; }, 350) : request('/attendance', { method: 'POST', body: { courseId, date, marks } });

export const getHistory = (courseId) =>
  USE_MOCK ? mock(() => {
    const all = db.get('attendance');
    return Object.entries(all).filter(([k]) => k.startsWith(`${courseId}|`)).map(([k, v]) => ({ date: k.split('|')[1], marks: v })).sort((a, b) => b.date.localeCompare(a.date));
  }, 120) : request(`/attendance/history?course=${courseId}`);

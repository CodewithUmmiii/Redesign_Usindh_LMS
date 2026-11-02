import { USE_MOCK, request, mock } from './client';
import { db } from './mockDb';
import { QUIZ_BANK } from '../data/mock';

export const listQuizzes = () => (USE_MOCK ? mock(() => db.get('quizzes')) : request('/quizzes'));
export const questionBank = () => (USE_MOCK ? mock(() => QUIZ_BANK, 100) : request('/quizzes/bank'));
export const createQuiz = (q) =>
  USE_MOCK ? mock(() => { const item = { id: `q${Date.now()}`, attempts: 0, avg: 0, mine: { status: 'upcoming' }, ...q }; db.update('quizzes', (l) => [item, ...l]); return item; }, 250) : request('/quizzes', { method: 'POST', body: q });
export const publishQuiz = (id) =>
  USE_MOCK ? mock(() => db.update('quizzes', (l) => l.map((q) => (q.id === id ? { ...q, status: 'published', mine: { status: 'available' } } : q))), 150) : request(`/quizzes/${id}/publish`, { method: 'POST' });
export const submitQuiz = (id, score) =>
  USE_MOCK ? mock(() => db.update('quizzes', (l) => l.map((q) => (q.id === id ? { ...q, attempts: q.attempts + 1, mine: { status: 'done', score } } : q))), 300) : request(`/quizzes/${id}/attempt`, { method: 'POST', body: { score } });

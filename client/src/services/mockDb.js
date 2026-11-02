// Tiny localStorage-backed store so the prototype feels stateful without a server.
import {
  COURSES, STUDENTS, ASSIGNMENTS, QUIZZES, ANNOUNCEMENTS, NOTIFICATIONS, THREADS, LIVE_CLASSES,
  CAL_EVENTS, DEFAULT_DISTRIBUTION, MARKS, STUDENT_RESULTS, INTEGRATIONS, USERS,
} from '../data/mock';

const KEY = 'usindh-lms-db-v1';

const seed = () => structuredClone({
  courses: COURSES, students: STUDENTS, assignments: ASSIGNMENTS, quizzes: QUIZZES, announcements: ANNOUNCEMENTS,
  notifications: NOTIFICATIONS, threads: THREADS, live: LIVE_CLASSES, events: CAL_EVENTS,
  distribution: Object.fromEntries(COURSES.map((c) => [c.id, DEFAULT_DISTRIBUTION])), marks: MARKS,
  studentResults: STUDENT_RESULTS, integrations: INTEGRATIONS, profiles: USERS, materials: {
    c1: [
      { id: 'm1', name: 'Week 1 — Introduction.pdf', size: '1.2 MB', at: new Date(Date.now() - 20 * 864e5).toISOString() },
      { id: 'm2', name: 'Refactoring catalogue.pdf', size: '3.4 MB', at: new Date(Date.now() - 9 * 864e5).toISOString() },
    ],
  },
  attendance: {}, // { `${courseId}|${yyyy-mm-dd}`: { studentId: 'P'|'A'|'L' } }
});

let state;
try { state = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { state = seed(); }
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ } };

export const db = {
  get: (k) => structuredClone(state[k]),
  set: (k, v) => { state[k] = structuredClone(v); persist(); return v; },
  update: (k, fn) => { const next = fn(structuredClone(state[k])); state[k] = next; persist(); return structuredClone(next); },
  reset: () => { state = seed(); persist(); },
};

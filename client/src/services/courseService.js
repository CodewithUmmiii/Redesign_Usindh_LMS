import { USE_MOCK, request, mock } from './client';
import { db } from './mockDb';

export const listCourses = () => (USE_MOCK ? mock(() => db.get('courses')) : request('/courses'));
export const getCourse = (id) => (USE_MOCK ? mock(() => db.get('courses').find((c) => c.id === id)) : request(`/courses/${id}`));
export const listStudents = (courseId) => (USE_MOCK ? mock(() => db.get('students')) : request(`/courses/${courseId}/students`));

export const toggleTopic = (courseId, index) =>
  USE_MOCK
    ? mock(() => db.update('courses', (cs) => cs.map((c) => {
        if (c.id !== courseId) return c;
        c.topics[index][1] = !c.topics[index][1];
        return c;
      })).find((c) => c.id === courseId), 60)
    : request(`/courses/${courseId}/topics/${index}/toggle`, { method: 'POST' });

export const listMaterials = (courseId) => (USE_MOCK ? mock(() => db.get('materials')[courseId] || []) : request(`/courses/${courseId}/materials`));
export const addMaterial = (courseId, file) =>
  USE_MOCK
    ? mock(() => {
        const item = { id: `m${Date.now()}`, name: file.name, size: `${Math.max(1, Math.round(file.size / 1024))} KB`, at: new Date().toISOString() };
        db.update('materials', (m) => ({ ...m, [courseId]: [item, ...(m[courseId] || [])] }));
        return item;
      }, 300)
    : request(`/courses/${courseId}/materials`, { method: 'POST', body: { name: file.name, size: file.size } });
export const removeMaterial = (courseId, id) =>
  USE_MOCK ? mock(() => { db.update('materials', (m) => ({ ...m, [courseId]: (m[courseId] || []).filter((x) => x.id !== id) })); return true; }, 100) : request(`/courses/${courseId}/materials/${id}`, { method: 'DELETE' });

export const listAnnouncements = () => (USE_MOCK ? mock(() => db.get('announcements')) : request('/announcements'));
export const postAnnouncement = (a) =>
  USE_MOCK ? mock(() => { const item = { id: `an${Date.now()}`, at: new Date().toISOString(), ...a }; db.update('announcements', (l) => [item, ...l]); return item; }, 200) : request('/announcements', { method: 'POST', body: a });

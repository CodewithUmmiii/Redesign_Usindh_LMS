import { USE_MOCK, request, mock } from './client';
import { db } from './mockDb';

export const listThreads = () => (USE_MOCK ? mock(() => db.get('threads')) : request('/messages'));
export const sendMessage = (threadId, text) =>
  USE_MOCK ? mock(() => db.update('threads', (t) => t.map((x) => (x.id === threadId ? { ...x, messages: [...x.messages, { from: 'me', text, at: new Date().toISOString() }] } : x))), 120) : request(`/messages/${threadId}`, { method: 'POST', body: { text } });
export const listNotifications = () => (USE_MOCK ? mock(() => db.get('notifications'), 80) : request('/notifications'));
export const markAllRead = () => (USE_MOCK ? mock(() => db.update('notifications', (n) => n.map((x) => ({ ...x, unread: false }))), 60) : request('/notifications/read', { method: 'POST' }));

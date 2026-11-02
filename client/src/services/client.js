import { API_BASE_URL, USE_MOCK } from '../config/env';

export { USE_MOCK };

/** Real HTTP call for when the Express API is available. */
export async function request(path, { method = 'GET', body } = {}) {
  const token = (() => { try { return localStorage.getItem('usindh-token'); } catch { return null; } })();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || `Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

/** Resolve mock data after a short delay so loading states are exercised. */
export const mock = (fn, ms = 220) => new Promise((resolve, reject) => {
  setTimeout(() => { try { resolve(fn()); } catch (e) { reject(e); } }, ms);
});

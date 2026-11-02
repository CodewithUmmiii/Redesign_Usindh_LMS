export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const LOGO_URL = import.meta.env.VITE_LOGO_URL || 'https://usindh.edu.pk/resource/images/logo.png';
export const UNIVERSITY = {
  name: 'University of Sindh',
  city: 'Jamshoro',
  short: 'USindh',
  portal: 'LMS Portal',
};

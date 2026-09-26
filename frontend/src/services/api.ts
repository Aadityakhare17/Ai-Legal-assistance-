import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? 'http://localhost:8000' : '');

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nyayasetu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nyayasetu_token');
      localStorage.removeItem('nyayasetu_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { email: string; full_name: string; password: string }) =>
    api.post('/api/auth/register', data).then(r => r.data),

  login: (email: string, password: string) =>
    api.post('/api/auth/login', new URLSearchParams({ username: email, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ).then(r => r.data),

  demoLogin: () =>
    api.post('/api/auth/demo-login').then(r => r.data),

  getMe: () =>
    api.get('/api/auth/me').then(r => r.data),
};

// ─── Documents ──────────────────────────────────────────────────────────────

export const documentsApi = {
  uploadDocument: (file: File, onProgress?: (p: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    }).then(r => r.data);
  },

  listDocuments: () =>
    api.get('/api/documents').then(r => r.data),

  getDemoDocuments: () =>
    api.get('/api/documents/demo').then(r => r.data),

  getDocument: (id: number) =>
    api.get(`/api/documents/${id}`).then(r => r.data),

  getAnalysis: (id: number) =>
    api.get(`/api/documents/${id}/analysis`).then(r => r.data),

  askDocument: (id: number, question: string, mode: 'document' | 'general' = 'document') =>
    api.post(`/api/documents/${id}/ask`, { question, mode }).then(r => r.data),

  compareDocuments: (doc_a_id: number, doc_b_id: number) =>
    api.post('/api/documents/compare', { document_a_id: doc_a_id, document_b_id: doc_b_id }).then(r => r.data),

  getTimeline: (id: number) =>
    api.get(`/api/documents/${id}/timeline`).then(r => r.data),

  getObligations: (id: number) =>
    api.get(`/api/documents/${id}/obligations`).then(r => r.data),

  createLawyerBrief: (id: number, userConcern?: string) =>
    api.post(`/api/documents/${id}/lawyer-brief`, { user_concern: userConcern }).then(r => r.data),

  deleteDocument: (id: number) =>
    api.delete(`/api/documents/${id}`).then(r => r.data),

  getStats: () =>
    api.get('/api/documents/stats/summary').then(r => r.data),
};

// ─── Constitution & Citizen Rights ─────────────────────────────────────────

export const constitutionApi = {
  getRights: () =>
    api.get('/api/constitution/rights').then(r => r.data.data),

  getEducationRights: () =>
    api.get('/api/constitution/education-rights').then(r => r.data.data),

  getHealthRights: () =>
    api.get('/api/constitution/health-rights').then(r => r.data.data),

  getRemedies: () =>
    api.get('/api/constitution/remedies').then(r => r.data.data),

  getLegalAid: () =>
    api.get('/api/constitution/legal-aid').then(r => r.data.data),

  askConstitution: (query: string) =>
    api.post('/api/constitution/ask', { query }).then(r => r.data),
};

export default api;

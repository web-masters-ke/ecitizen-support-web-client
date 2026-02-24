'use client'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4010/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phoneNumber?: string
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  me: () => api.get('/auth/me'),

  logout: () => api.post('/auth/logout'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
}

// ─── Tickets ──────────────────────────────────────────────────────────────────
export const ticketsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get('/tickets', { params }),

  get: (id: string) => api.get(`/tickets/${id}`),

  create: (data: Record<string, unknown>) => api.post('/tickets', data),

  addMessage: (id: string, content: string) =>
    api.post(`/tickets/${id}/messages`, { content }),

  getMessages: (id: string) => api.get(`/tickets/${id}/messages`),

  getHistory: (id: string) => api.get(`/tickets/${id}/history`),

  getAttachments: (id: string) => api.get(`/tickets/${id}/attachments`),

  categories: (params?: Record<string, unknown>) =>
    api.get('/ticket-categories', { params }),

  priorities: () => api.get('/ticket-priorities'),

  statuses: () => api.get('/ticket-statuses'),
}

// ─── Agencies ─────────────────────────────────────────────────────────────────
export const agenciesApi = {
  list: (params?: Record<string, unknown>) => api.get('/agencies', { params }),
  get: (id: string) => api.get(`/agencies/${id}`),
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────
export const kbApi = {
  articles: (params?: Record<string, unknown>) =>
    api.get('/kb/articles', { params }),

  article: (id: string) => api.get(`/kb/articles/${id}`),

  categories: () => api.get('/kb/categories'),

  tags: () => api.get('/kb/tags'),

  feedback: (id: string, helpful: boolean) =>
    api.post(`/kb/articles/${id}/feedback`, { helpful }),
}

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get('/notifications', { params }),

  markRead: (id: string) => api.patch(`/notifications/${id}/read`),

  markAllRead: () => api.patch('/notifications/read-all'),
}

// ─── Users (profile) ──────────────────────────────────────────────────────────
export const usersApi = {
  me: () => api.get('/auth/me'),

  updateProfile: (id: string, data: Record<string, unknown>) =>
    api.patch(`/users/${id}`, data),

  changePassword: (
    id: string,
    data: { currentPassword: string; newPassword: string }
  ) => api.patch(`/users/${id}/password`, data),
}

// ─── Health ───────────────────────────────────────────────────────────────────
export const healthApi = {
  status: () => api.get('/health'),
}

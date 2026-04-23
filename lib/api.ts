'use client'
import axios from 'axios'
import type { AxiosInstance } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL
if (!baseURL) throw new Error('NEXT_PUBLIC_API_URL is not set — add it to .env.local')

const api: AxiosInstance = axios.create({
  baseURL,
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

// Track whether a refresh is already in-flight to prevent cascading calls
let isRefreshing = false
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const url: string = err.config?.url ?? ''
    const isAuthCall =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh')

    if (err.response?.status === 401 && typeof window !== 'undefined' && !isAuthCall) {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(err)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          err.config.headers.Authorization = `Bearer ${token}`
          return api.request(err.config)
        })
      }

      isRefreshing = true
      try {
        const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
        const { accessToken, refreshToken: newRefresh } = res.data?.data ?? res.data
        localStorage.setItem('accessToken', accessToken)
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh)
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        processQueue(null, accessToken)
        err.config.headers.Authorization = `Bearer ${accessToken}`
        return api.request(err.config)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
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
    nationalId?: string
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  me: () => api.get('/auth/me'),

  logout: () => api.post('/auth/logout'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
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

  updateProfile: (_id: string, data: Record<string, unknown>) =>
    api.patch('/users/me', data),

  changePassword: (
    id: string,
    data: { currentPassword: string; newPassword: string }
  ) => api.patch(`/users/${id}/password`, data),
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactApi = {
  submit: (data: { fullName: string; email: string; phone?: string; subject: string; message: string }) =>
    api.post('/contact', data),
}

// ─── Health ───────────────────────────────────────────────────────────────────
export const healthApi = {
  status: () => api.get('/health'),
}

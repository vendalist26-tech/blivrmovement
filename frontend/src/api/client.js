import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api/v1'

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    if (status === 401 && url.includes('/admin/')) {
      useAuthStore.getState().clearAuth()
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
        window.location.assign('/admin/login?session=expired')
      }
    }
    return Promise.reject(error)
  },
)

export async function fetchPublicSite() {
  const { data } = await api.get('/site')
  return data.data
}

export async function fetchPublicUpcomingMeetings() {
  const { data } = await api.get('/upcoming-meetings')
  return data.data
}

export async function fetchAdminUpcomingMeetings() {
  const { data } = await api.get('/admin/upcoming-meetings')
  return data.data
}

export async function updateAdminUpcomingMeetings(payload) {
  const { data } = await api.put('/admin/upcoming-meetings', payload)
  return data
}

export async function uploadUpcomingMeetingImage(file) {
  const form = new FormData()
  form.append('image', file)
  const { data } = await api.post('/admin/upcoming-meetings/upload-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function fetchAdminSite() {
  const { data } = await api.get('/admin/site')
  return data.data
}

export async function updateAdminSite(value) {
  const { data } = await api.put('/admin/site', { value })
  return data
}

export async function uploadSiteImage(file, folder = 'homepage') {
  const form = new FormData()
  form.append('image', file)
  form.append('folder', folder)
  const { data } = await api.post('/admin/site/upload-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function loginRequest(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function logoutRequest() {
  await api.post('/admin/auth/logout')
}

export async function submitGetConnected(payload) {
  const { data } = await api.post('/get-connected', payload)
  return data
}

export async function fetchAdminGetConnected(params = {}) {
  const { data } = await api.get('/admin/get-connected', { params })
  return data
}

export async function fetchAdminGetConnectedSettings() {
  const { data } = await api.get('/admin/get-connected-settings')
  return data.data
}

export async function updateAdminGetConnectedSettings(payload) {
  const { data } = await api.put('/admin/get-connected-settings', payload)
  return data
}

export async function fetchAdminGetConnectedInfo() {
  const { data } = await api.get('/admin/get-connected-info')
  return data.data
}

export async function updateAdminGetConnectedInfo(payload) {
  const { data } = await api.put('/admin/get-connected-info', payload)
  return data
}

export async function deleteAdminGetConnected(id) {
  const { data } = await api.delete(`/admin/get-connected/${id}`)
  return data
}

export async function fetchAdminUsers() {
  const { data } = await api.get('/admin/users')
  return data
}

export async function createAdminUser(payload) {
  const { data } = await api.post('/admin/users', payload)
  return data
}

export async function updateAdminUser(id, payload) {
  const { data } = await api.put(`/admin/users/${id}`, payload)
  return data
}

export async function deleteAdminUser(id) {
  const { data } = await api.delete(`/admin/users/${id}`)
  return data
}

export async function submitMeetingRsvp(payload) {
  const { data } = await api.post('/meeting-rsvp', payload)
  return data.data
}

export async function fetchAdminMeetingRsvps(params = {}) {
  const { data } = await api.get('/admin/meeting-rsvps', { params })
  return data
}

export async function deleteMeetingRsvp(id) {
  const { data } = await api.delete(`/admin/meeting-rsvps/${id}`)
  return data
}

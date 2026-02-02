import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshing: Promise<string> | null = null

async function refreshAccessToken() {
  const res = await api.post<{ accessToken: string }>('/api/auth/refresh')
  return res.data.accessToken
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config as any
    const status = error?.response?.status

    if (status === 401 && !original?._retry) {
      original._retry = true
      try {
        refreshing = refreshing ?? refreshAccessToken()
        const newToken = await refreshing
        setAccessToken(newToken)
        refreshing = null
        return api(original)
      } catch (e) {
        refreshing = null
        setAccessToken(null)
        return Promise.reject(e)
      }
    }

    return Promise.reject(error)
  },
)


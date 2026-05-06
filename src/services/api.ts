import axios, { type AxiosError } from 'axios'

export const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let _refreshing: Promise<string> | null = null

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config
    if (error.response?.status !== 401 || !original) return Promise.reject(error)

    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) return Promise.reject(error)

    if (!_refreshing) {
      _refreshing = axios
        .post<{ access_token: string }>('/api/v1/auth/refresh', {
          refresh_token: refreshToken,
        })
        .then((resp) => {
          const { access_token, refresh_token } = resp.data as {
            access_token: string
            refresh_token: string
          }
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)
          return access_token
        })
        .catch((err) => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          return Promise.reject(err)
        })
        .finally(() => {
          _refreshing = null
        })
    }

    const newToken = await _refreshing
    original.headers.Authorization = `Bearer ${newToken}`
    return api(original)
  },
)

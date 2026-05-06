import { api } from '@/services/api'

import type { LoginRequest, RefreshRequest, RegisterRequest, TokenResponse, User } from './types'

export async function register(data: RegisterRequest): Promise<TokenResponse> {
  const resp = await api.post<TokenResponse>('/auth/register', data)
  return resp.data
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const resp = await api.post<TokenResponse>('/auth/login', data)
  return resp.data
}

export async function refresh(data: RefreshRequest): Promise<TokenResponse> {
  const resp = await api.post<TokenResponse>('/auth/refresh', data)
  return resp.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function getMe(): Promise<User> {
  const resp = await api.get<User>('/auth/me')
  return resp.data
}

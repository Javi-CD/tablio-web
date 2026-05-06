import { useMutation, useQueryClient } from '@tanstack/react-query'

import { login, logout, register } from './api'
import type { LoginRequest, RegisterRequest, TokenResponse } from './types'

function saveTokens(tokens: TokenResponse) {
  localStorage.setItem('access_token', tokens.access_token)
  localStorage.setItem('refresh_token', tokens.refresh_token)
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (tokens) => {
      saveTokens(tokens)
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (tokens) => {
      saveTokens(tokens)
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      queryClient.clear()
    },
  })
}

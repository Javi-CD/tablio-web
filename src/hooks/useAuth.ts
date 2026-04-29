import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getMe, logout } from '@/features/auth/api'
import type { User } from '@/features/auth/types'

export interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!localStorage.getItem('access_token'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      queryClient.clear()
    }
  }

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    logout: handleLogout,
  }
}

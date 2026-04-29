import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import type { User } from '@/features/auth/types'
import { useAuth } from '@/hooks/useAuth'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
    useQueryClient: vi.fn(() => ({
      clear: vi.fn(),
    })),
  }
})

vi.mock('@/features/auth/api', () => ({
  getMe: vi.fn(),
  logout: vi.fn(),
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should return unauthenticated state when no token is present', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as UseQueryResult<User | null, Error>)

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should return authenticated state when user data is available', () => {
    const mockUser = { id: '1', email: 'test@tablio.co', full_name: 'Test' }
    vi.mocked(useQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
    } as UseQueryResult<User | null, Error>)

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle logout correctly', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { id: '1', email: 'test@tablio.co', full_name: 'Test' },
      isLoading: false,
    } as UseQueryResult<User | null, Error>)

    const { result } = renderHook(() => useAuth())

    await result.current.logout()

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })
})

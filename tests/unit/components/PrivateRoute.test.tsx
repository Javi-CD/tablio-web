import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import PrivateRoute from '@/components/layout/PrivateRoute'
import { useAuth } from '@/hooks/useAuth'

vi.mock('@/hooks/useAuth')

describe('PrivateRoute', () => {
  it('should show loading state', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('should redirect to login if not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      logout: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <div>Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })

  it('should render children if authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: '1',
        email: 'test@tablio.co',
        full_name: 'Test',
        is_active: true,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      logout: vi.fn(),
    })

    render(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText(/protected content/i)).toBeInTheDocument()
  })
})

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import * as authApi from '@/features/auth/api'
import LoginPage from '@/pages/auth/LoginPage'

vi.mock('@/features/auth/api')

function renderLoginPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders email and password fields', () => {
    renderLoginPage()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('shows validation error when submitting empty form', async () => {
    renderLoginPage()
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('shows validation error for invalid email', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'not-an-email')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('calls login API with correct credentials', async () => {
    const mockLogin = vi.mocked(authApi.login).mockResolvedValue({
      access_token: 'at',
      refresh_token: 'rt',
      token_type: 'bearer',
    })
    renderLoginPage()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'user@tablio.co')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@tablio.co',
        password: 'password123',
      })
    })
  })

  it('shows API error message on failed login', async () => {
    const error = { response: { data: { detail: 'Correo o contraseña incorrectos.' } } }
    vi.mocked(authApi.login).mockRejectedValue(error)
    renderLoginPage()
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'user@tablio.co')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('has a link to the register page', () => {
    renderLoginPage()
    expect(screen.getByRole('link', { name: /crear una cuenta/i })).toBeInTheDocument()
  })
})

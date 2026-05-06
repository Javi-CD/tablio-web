import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import * as authApi from '@/features/auth/api'
import RegisterPage from '@/pages/auth/RegisterPage'

vi.mock('@/features/auth/api')

function renderRegisterPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/register']}>
        <RegisterPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders name, email, and password fields', () => {
    renderRegisterPage()
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('shows error when password is too short', async () => {
    renderRegisterPage()
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Test User')
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'user@tablio.co')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'short')
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('calls register API with correct data', async () => {
    vi.mocked(authApi.register).mockResolvedValue({
      access_token: 'at',
      refresh_token: 'rt',
      token_type: 'bearer',
    })
    renderRegisterPage()
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Javier Pérez')
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'javier@tablio.co')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'Secure123!')
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        full_name: 'Javier Pérez',
        email: 'javier@tablio.co',
        password: 'Secure123!',
      })
    })
  })

  it('shows server error on duplicate email', async () => {
    const error = { response: { data: { detail: 'Email already registered.' } } }
    vi.mocked(authApi.register).mockRejectedValue(error)
    renderRegisterPage()
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Test')
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'dup@tablio.co')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'Secure123!')
    await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('has a link to the login page', () => {
    renderRegisterPage()
    expect(screen.getByRole('link', { name: /inicia sesión/i })).toBeInTheDocument()
  })
})

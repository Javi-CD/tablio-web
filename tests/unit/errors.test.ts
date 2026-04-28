import { describe, expect, it } from 'vitest'

import { getErrorMessage } from '@/locales/errors'

describe('getErrorMessage', () => {
  it('returns the Spanish message for a known error code', () => {
    expect(getErrorMessage('INVALID_CREDENTIALS')).toBe('Correo o contraseña incorrectos.')
  })

  it('returns the fallback for an unknown code when provided', () => {
    expect(getErrorMessage('UNKNOWN_CODE', 'Error genérico')).toBe('Error genérico')
  })

  it('returns the default fallback when code is unknown and no fallback given', () => {
    expect(getErrorMessage('UNKNOWN_CODE')).toBe('Ocurrió un error inesperado.')
  })
})

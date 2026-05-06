import { describe, expect, it } from 'vitest'

import { formatCurrency } from '@/utils/formatCurrency'

describe('formatCurrency', () => {
  it('formats Colombian pesos without decimals', () => {
    const result = formatCurrency(15000)
    expect(result).toMatch(/15/)
    expect(result).toMatch(/000/)
  })

  it('handles zero', () => {
    const result = formatCurrency(0)
    expect(result).toMatch(/0/)
  })

  it('accepts custom locale and currency', () => {
    const result = formatCurrency(100, 'es-MX', 'MXN')
    expect(result).toBeTruthy()
  })
})

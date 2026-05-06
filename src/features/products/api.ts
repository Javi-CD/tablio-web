import { api } from '@/services/api'

import type { Product, ProductCreate, ProductUpdate } from './types'

export async function listProducts(restaurantId: string): Promise<Product[]> {
  const resp = await api.get<Product[]>(`/restaurants/${restaurantId}/products`)
  return resp.data
}

export async function createProduct(restaurantId: string, data: ProductCreate): Promise<Product> {
  const resp = await api.post<Product>(`/restaurants/${restaurantId}/products`, data)
  return resp.data
}

export async function updateProduct(productId: string, data: ProductUpdate): Promise<Product> {
  const resp = await api.patch<Product>(`/products/${productId}`, data)
  return resp.data
}

export async function deleteProduct(productId: string): Promise<void> {
  await api.delete(`/products/${productId}`)
}

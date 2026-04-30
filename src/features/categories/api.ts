import { api } from '@/services/api'

import type { Category, CategoryCreate, CategoryUpdate } from './types'

export async function listCategories(restaurantId: string): Promise<Category[]> {
  const resp = await api.get<Category[]>(`/restaurants/${restaurantId}/categories`)
  return resp.data
}

export async function createCategory(
  restaurantId: string,
  data: CategoryCreate,
): Promise<Category> {
  const resp = await api.post<Category>(`/restaurants/${restaurantId}/categories`, data)
  return resp.data
}

export async function updateCategory(categoryId: string, data: CategoryUpdate): Promise<Category> {
  const resp = await api.patch<Category>(`/categories/${categoryId}`, data)
  return resp.data
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await api.delete(`/categories/${categoryId}`)
}

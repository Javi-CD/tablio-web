import { api } from '@/services/api'

import type { Restaurant, RestaurantCreate, RestaurantUpdate } from './types'

export async function createRestaurant(data: RestaurantCreate): Promise<Restaurant> {
  const resp = await api.post<Restaurant>('/restaurants', data)
  return resp.data
}

export async function getMyRestaurant(): Promise<Restaurant> {
  const resp = await api.get<Restaurant>('/restaurants/me')
  return resp.data
}

export async function updateRestaurant(id: string, data: RestaurantUpdate): Promise<Restaurant> {
  const resp = await api.patch<Restaurant>(`/restaurants/${id}`, data)
  return resp.data
}

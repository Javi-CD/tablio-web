import { api } from '@/services/api'

import type { PublicMenu, PublicRestaurant } from './types'

export async function getPublicMenu(slug: string): Promise<PublicMenu> {
  const resp = await api.get<PublicMenu>(`/public/menus/${slug}`)
  return resp.data
}

export async function getPublicRestaurant(slug: string): Promise<PublicRestaurant> {
  const resp = await api.get<PublicRestaurant>(`/public/restaurants/${slug}`)
  return resp.data
}

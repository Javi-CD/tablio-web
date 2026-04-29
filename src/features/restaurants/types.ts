export interface Restaurant {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  phone: string | null
  address: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RestaurantCreate {
  name: string
  description?: string | null
  logo_url?: string | null
  phone?: string | null
  address?: string | null
}

export interface RestaurantUpdate {
  name?: string
  slug?: string
  description?: string | null
  logo_url?: string | null
  phone?: string | null
  address?: string | null
}

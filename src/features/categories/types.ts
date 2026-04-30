export interface Category {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CategoryCreate {
  name: string
  description?: string | null
  sort_order?: number
}

export interface CategoryUpdate {
  name?: string
  description?: string | null
  sort_order?: number
  is_active?: boolean
}

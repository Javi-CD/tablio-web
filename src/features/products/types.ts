export interface Product {
  id: string
  restaurant_id: string
  category_id: string | null
  name: string
  description: string | null
  price: string
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface ProductCreate {
  name: string
  price: string
  description?: string | null
  image_url?: string | null
  category_id?: string | null
}

export interface ProductUpdate {
  name?: string
  price?: string
  description?: string | null
  image_url?: string | null
  category_id?: string | null
  is_available?: boolean
}

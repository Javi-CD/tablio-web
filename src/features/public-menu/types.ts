export interface PublicProduct {
  id: string
  name: string
  description: string | null
  price: string
  image_url: string | null
}

export interface PublicCategory {
  id: string
  name: string
  description: string | null
  sort_order: number
  products: PublicProduct[]
}

export interface PublicRestaurant {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  phone: string | null
  address: string | null
}

export interface PublicMenu {
  restaurant: PublicRestaurant
  categories: PublicCategory[]
}

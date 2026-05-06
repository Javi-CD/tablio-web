import { createContext } from 'react'

export interface CartItem {
  productId: string
  name: string
  price: string
  image_url: string | null
  quantity: number
}

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  total: number
  add: (item: Omit<CartItem, 'quantity'>) => void
  remove: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
  getQuantity: (productId: string) => number
}

export const CartContext = createContext<CartContextValue | null>(null)

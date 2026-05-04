export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'completed' | 'cancelled'
export type OrderType = 'table' | 'delivery' | 'pickup'

export interface OrderItem {
  id: string
  product_id: string | null
  product_name: string
  unit_price: string
  quantity: number
  subtotal: string
}

export interface Order {
  id: string
  restaurant_id: string
  customer_name: string
  customer_phone: string | null
  customer_notes: string | null
  table_number: string | null
  status: OrderStatus
  order_type: OrderType
  total_amount: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItemCreate {
  product_id: string
  quantity: number
}

export interface OrderCreate {
  customer_name: string
  customer_phone?: string | null
  customer_notes?: string | null
  order_type: OrderType
  table_number?: string | null
  items: OrderItemCreate[]
}

export interface OrderStatusUpdate {
  status: OrderStatus
}

export interface OrdersListResponse {
  items: Order[]
  total: number
  page: number
  limit: number
  pages: number
}

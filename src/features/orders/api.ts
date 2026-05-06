import { api } from '@/services/api'

import type {
  Order,
  OrderCreate,
  OrdersListResponse,
  OrderStatus,
  OrderStatusUpdate,
} from './types'

export async function createOrder(slug: string, data: OrderCreate): Promise<Order> {
  const res = await api.post<Order>(`/public/restaurants/${slug}/orders`, data)
  return res.data
}

export async function listOrders(
  restaurantId: string,
  params: { page?: number; limit?: number; status?: OrderStatus },
): Promise<OrdersListResponse> {
  const res = await api.get<OrdersListResponse>(`/restaurants/${restaurantId}/orders`, { params })
  return res.data
}

export async function getOrder(orderId: string): Promise<Order> {
  const res = await api.get<Order>(`/orders/${orderId}`)
  return res.data
}

export async function updateOrderStatus(orderId: string, data: OrderStatusUpdate): Promise<Order> {
  const res = await api.patch<Order>(`/orders/${orderId}/status`, data)
  return res.data
}

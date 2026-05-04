import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createOrder, listOrders, updateOrderStatus } from './api'
import type { OrderCreate, OrderStatus, OrderStatusUpdate } from './types'

export function useOrders(
  restaurantId: string | undefined,
  params?: { page?: number; limit?: number; status?: OrderStatus },
) {
  return useQuery({
    queryKey: ['orders', restaurantId, params],
    queryFn: () => listOrders(restaurantId!, params ?? {}),
    enabled: !!restaurantId,
    refetchInterval: 15_000,
  })
}

export function useCreateOrder(slug: string) {
  return useMutation({
    mutationFn: (data: OrderCreate) => createOrder(slug, data),
  })
}

export function useUpdateOrderStatus(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: OrderStatusUpdate }) =>
      updateOrderStatus(orderId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders', restaurantId] })
    },
  })
}

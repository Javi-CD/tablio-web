import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createProduct, deleteProduct, listProducts, updateProduct } from './api'
import type { ProductCreate, ProductUpdate } from './types'

export function useProducts(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ['products', restaurantId],
    queryFn: () => listProducts(restaurantId!),
    enabled: !!restaurantId,
  })
}

export function useCreateProduct(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductCreate) => createProduct(restaurantId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products', restaurantId] })
    },
  })
}

export function useUpdateProduct(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductUpdate }) => updateProduct(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products', restaurantId] })
    },
  })
}

export function useDeleteProduct(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products', restaurantId] })
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getAxiosErrorMessage } from '@/locales/errors'
import { t } from '@/locales/es'

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
      toast.success(t.toast.productCreated)
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, t.toast.errorGeneric))
    },
  })
}

export function useUpdateProduct(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductUpdate }) => updateProduct(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products', restaurantId] })
      toast.success(t.toast.productUpdated)
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, t.toast.errorGeneric))
    },
  })
}

export function useDeleteProduct(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products', restaurantId] })
      toast.success(t.toast.productDeleted)
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, t.toast.errorGeneric))
    },
  })
}

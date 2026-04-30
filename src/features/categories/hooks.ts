import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createCategory, deleteCategory, listCategories, updateCategory } from './api'
import type { CategoryCreate, CategoryUpdate } from './types'

export function useCategories(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ['categories', restaurantId],
    queryFn: () => listCategories(restaurantId!),
    enabled: !!restaurantId,
  })
}

export function useCreateCategory(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CategoryCreate) => createCategory(restaurantId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] })
    },
  })
}

export function useUpdateCategory(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdate }) => updateCategory(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] })
    },
  })
}

export function useDeleteCategory(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] })
    },
  })
}

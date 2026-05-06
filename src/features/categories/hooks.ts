import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getAxiosErrorMessage } from '@/locales/errors'
import { t } from '@/locales/es'

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
      toast.success(t.toast.categoryCreated)
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, t.toast.errorGeneric))
    },
  })
}

export function useUpdateCategory(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdate }) => updateCategory(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] })
      toast.success(t.toast.categoryUpdated)
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, t.toast.errorGeneric))
    },
  })
}

export function useDeleteCategory(restaurantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] })
      toast.success(t.toast.categoryDeleted)
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, t.toast.errorGeneric))
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getAxiosErrorMessage } from '@/locales/errors'
import { t } from '@/locales/es'

import { createRestaurant, getMyRestaurant, updateRestaurant } from './api'
import type { RestaurantCreate, RestaurantUpdate } from './types'

export function useMyRestaurant() {
  return useQuery({
    queryKey: ['restaurant', 'me'],
    queryFn: getMyRestaurant,
    retry: false,
  })
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RestaurantCreate) => createRestaurant(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['restaurant', 'me'] })
      toast.success(t.toast.restaurantSaved)
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, t.toast.errorGeneric))
    },
  })
}

export function useUpdateRestaurant(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RestaurantUpdate) => updateRestaurant(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['restaurant', 'me'] })
      toast.success(t.toast.restaurantSaved)
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, t.toast.errorGeneric))
    },
  })
}

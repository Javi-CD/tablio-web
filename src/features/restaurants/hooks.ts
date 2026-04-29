import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
    },
  })
}

export function useUpdateRestaurant(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RestaurantUpdate) => updateRestaurant(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['restaurant', 'me'] })
    },
  })
}

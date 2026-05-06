import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

interface UseWebSocketOptions {
  restaurantId: string | undefined
  enabled: boolean
  onNewOrder?: () => void
}

export function useWebSocket({ restaurantId, enabled, onNewOrder }: UseWebSocketOptions): void {
  const queryClient = useQueryClient()
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onNewOrderRef = useRef(onNewOrder)
  onNewOrderRef.current = onNewOrder

  useEffect(() => {
    if (!enabled || !restaurantId) return

    const token = localStorage.getItem('access_token')
    if (!token) return

    let active = true
    let wsInstance: WebSocket | null = null

    const connect = () => {
      if (!active) return

      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      wsInstance = new WebSocket(
        `${proto}//${window.location.host}/ws/restaurants/${restaurantId}?token=${encodeURIComponent(token)}`,
      )

      wsInstance.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as { event: string }
          void queryClient.invalidateQueries({ queryKey: ['orders', restaurantId] })
          if (msg.event === 'new_order') {
            onNewOrderRef.current?.()
          }
        } catch {
          // ignore malformed messages
        }
      }

      wsInstance.onclose = () => {
        if (!active) return
        reconnectRef.current = setTimeout(connect, 3_000)
      }
    }

    connect()

    return () => {
      active = false
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current)
        reconnectRef.current = null
      }
      wsInstance?.close()
    }
  }, [restaurantId, enabled, queryClient])
}

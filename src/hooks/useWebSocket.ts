// Phase 5: useWebSocket hook
// - Establishes WSS connection to /ws/restaurants/{restaurant_id}?token={jwt}
// - Listens for "new_order" events and invalidates the TanStack Query orders cache
// - Handles reconnection on disconnect
// - Fallback: if WebSocket unavailable, TanStack Query polls every 15s

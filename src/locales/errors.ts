const errorMessages: Record<string, string> = {
  RESTAURANT_NOT_FOUND: 'No encontramos ese restaurante.',
  PRODUCT_NOT_AVAILABLE: 'Este producto no está disponible en este momento.',
  PRODUCT_NOT_FOUND: 'No encontramos ese producto.',
  CATEGORY_NOT_FOUND: 'No encontramos esa categoría.',
  ORDER_NOT_FOUND: 'No encontramos ese pedido.',
  ORDER_ALREADY_CANCELLED: 'Este pedido ya fue cancelado.',
  INVALID_STATUS_TRANSITION: 'No es posible realizar ese cambio de estado.',
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos.',
  EMAIL_ALREADY_EXISTS: 'Ya existe una cuenta con ese correo electrónico.',
  SLUG_ALREADY_EXISTS: 'Ese identificador ya está en uso por otro restaurante.',
  RATE_LIMIT_EXCEEDED: 'Demasiados intentos. Intenta de nuevo en un minuto.',
  UNAUTHORIZED: 'Debes iniciar sesión para realizar esta acción.',
  FORBIDDEN: 'No tienes permiso para realizar esta acción.',
}

export function getErrorMessage(code: string, fallback?: string): string {
  return errorMessages[code] ?? fallback ?? 'Ocurrió un error inesperado.'
}

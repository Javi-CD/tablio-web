import type { FC } from 'react'

import type { OrderStatus } from '@/features/orders/types'

interface Props {
  status: OrderStatus
}

const CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-900',
  },
  accepted: {
    label: 'Aceptado',
    className: 'bg-blue-100 text-blue-800',
  },
  preparing: {
    label: 'Preparando',
    className: 'bg-purple-100 text-purple-800',
  },
  completed: {
    label: 'Completado',
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800',
  },
}

const OrderStatusBadge: FC<Props> = ({ status }) => {
  const { label, className } = CONFIG[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  )
}

export default OrderStatusBadge

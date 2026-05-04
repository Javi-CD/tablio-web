import { ChevronDown, ChevronUp } from 'lucide-react'
import { type FC, useEffect, useState } from 'react'

import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import { useOrders, useUpdateOrderStatus } from '@/features/orders/hooks'
import type { Order, OrderStatus, OrderType } from '@/features/orders/types'
import { useMyRestaurant } from '@/features/restaurants/hooks'
import { useWebSocket } from '@/hooks/useWebSocket'
import { t } from '@/locales/es'
import { formatCurrency } from '@/utils/formatCurrency'
import { playNotificationSound } from '@/utils/playNotificationSound'

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusFilter = 'all' | OrderStatus

// ─── State machine: valid next statuses per current status ────────────────────

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

const ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  accepted: t.order.actionAccept,
  preparing: t.order.actionPrepare,
  completed: t.order.actionComplete,
  cancelled: t.order.actionCancel,
}

// ─── Order type badge ─────────────────────────────────────────────────────────

const TYPE_LABELS: Record<OrderType, string> = {
  table: t.order.typeTable,
  delivery: t.order.typeDelivery,
  pickup: t.order.typePickup,
}

interface OrderTypeBadgeProps {
  type: OrderType
  tableNumber: string | null
}

function OrderTypeBadge({ type, tableNumber }: OrderTypeBadgeProps) {
  const label =
    type === 'table' && tableNumber ? `${t.order.tableNumber} ${tableNumber}` : TYPE_LABELS[type]
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
      {label}
    </span>
  )
}

// ─── Timestamp formatter ──────────────────────────────────────────────────────

function formatOrderTime(iso: string): string {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

// ─── Order Card ───────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: Order
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void
  isUpdating: boolean
}

function OrderCard({ order, onStatusChange, isUpdating }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)
  const nextStatuses = NEXT_STATUSES[order.status]

  return (
    <article className="w-full rounded-xl border border-border bg-card p-4">
      {/* Row 1: Status + type badges | timestamp */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <OrderStatusBadge status={order.status} />
          <OrderTypeBadge type={order.order_type} tableNumber={order.table_number} />
        </div>
        <time dateTime={order.created_at} className="text-xs text-muted-foreground">
          {formatOrderTime(order.created_at)}
        </time>
      </div>

      {/* Row 2: Customer name + total */}
      <div className="mb-2 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{order.customer_name}</p>
          {order.customer_phone && (
            <p className="truncate text-xs text-muted-foreground">{order.customer_phone}</p>
          )}
        </div>
        <p className="flex-shrink-0 text-base font-bold text-foreground">
          {formatCurrency(Number(order.total_amount))}
        </p>
      </div>

      {/* Notes */}
      {order.customer_notes && (
        <p className="mb-3 text-xs italic text-muted-foreground">
          &ldquo;{order.customer_notes}&rdquo;
        </p>
      )}

      {/* Action buttons — full-width columns on mobile, row on sm+ */}
      {nextStatuses.length > 0 && (
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {nextStatuses.map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(order.id, status)}
              disabled={isUpdating}
              className={[
                'w-full rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 sm:w-auto sm:py-1.5 sm:text-xs',
                status === 'cancelled'
                  ? 'border border-destructive text-destructive hover:bg-destructive/10'
                  : 'bg-primary text-primary-foreground hover:opacity-90',
              ].join(' ')}
            >
              {ACTION_LABELS[status]}
            </button>
          ))}
        </div>
      )}

      {/* Expandable items list */}
      {order.items.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3 flex-shrink-0" />
                {t.order.hideDetail}
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 flex-shrink-0" />
                {t.order.viewDetail} ({order.items.length})
              </>
            )}
          </button>

          {expanded && (
            <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-muted/30">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex min-w-0 items-center justify-between gap-2 px-3 py-2"
                >
                  <span className="min-w-0 truncate text-sm text-foreground">
                    <span className="font-semibold">{item.quantity}×</span> {item.product_name}
                  </span>
                  <span className="flex-shrink-0 text-sm font-medium text-foreground">
                    {formatCurrency(Number(item.subtotal))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTER_TABS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: t.order.filterAll },
  { value: 'pending', label: t.order.filterPending },
  { value: 'accepted', label: t.order.filterAccepted },
  { value: 'preparing', label: t.order.filterPreparing },
  { value: 'completed', label: t.order.filterCompleted },
  { value: 'cancelled', label: t.order.filterCancelled },
]

const OrdersPage: FC = () => {
  const { data: restaurant } = useMyRestaurant()
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [hasNewOrder, setHasNewOrder] = useState(false)

  const { data, isLoading, isError } = useOrders(
    restaurant?.id,
    filter !== 'all' ? { status: filter } : undefined,
  )

  const updateStatus = useUpdateOrderStatus(restaurant?.id ?? '')

  useWebSocket({
    restaurantId: restaurant?.id,
    enabled: !!restaurant,
    onNewOrder: () => {
      setHasNewOrder(true)
      playNotificationSound()
    },
  })

  // Listen for custom event to facilitate A11y/E2E testing
  useEffect(() => {
    const handler = () => {
      setHasNewOrder(true)
      playNotificationSound()
    }
    window.addEventListener('tablio:new_order', handler)
    return () => window.removeEventListener('tablio:new_order', handler)
  }, [])

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatus.mutate({ orderId, data: { status: newStatus } })
  }

  if (!restaurant) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">{t.order.noRestaurant}</div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">{t.order.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.order.pageSubtitle}</p>
      </div>

      {/* New order notification banner */}
      {hasNewOrder && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 px-4 py-3"
        >
          <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-amber-900">
            <span aria-hidden="true" className="flex-shrink-0">
              🔔
            </span>
            <span className="truncate">{t.order.newOrderBanner}</span>
          </p>
          <button
            onClick={() => setHasNewOrder(false)}
            className="ml-3 flex-shrink-0 rounded-lg px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
          >
            {t.order.newOrderAck}
          </button>
        </div>
      )}

      {/*
        Filter tabs — two-layer scroll pattern:
        Outer div (block): clips overflow and scrolls horizontally.
        Inner div (flex): sized to fit all buttons via w-max, min-w-full ensures
        it fills the container when there's plenty of space.
        This separates the scroll container from the flex container, which avoids
        browser inconsistencies when combining display:flex with overflow-x:auto.
      */}
      <div
        className="overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        <div
          className="flex w-max min-w-full gap-1.5 pb-1"
          role="tablist"
          aria-label="Filtrar pedidos por estado"
        >
          {FILTER_TABS.map(({ value, label }) => (
            <button
              key={value}
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={[
                'flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                filter === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t.order.loadingOrders}</p>
      ) : isError ? (
        <p className="py-10 text-center text-sm text-destructive">{t.order.errorLoading}</p>
      ) : !data?.items.length ? (
        <p className="py-16 text-center text-sm text-muted-foreground">{t.order.emptyState}</p>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {data.items.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              isUpdating={updateStatus.isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage

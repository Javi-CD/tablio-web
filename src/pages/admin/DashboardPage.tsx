import { type FC, useMemo } from 'react'

import OrderStatusBadge from '@/components/orders/OrderStatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useOrders } from '@/features/orders/hooks'
import type { Order } from '@/features/orders/types'
import { useProducts } from '@/features/products/hooks'
import { useMyRestaurant } from '@/features/restaurants/hooks'
import { t } from '@/locales/es'
import { formatCurrency } from '@/utils/formatCurrency'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

function formatOrderTime(iso: string): string {
  return new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  loading?: boolean
}

function StatCard({ label, value, loading }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {loading ? (
        <Skeleton className="mt-1 h-7 w-16" />
      ) : (
        <p className="text-2xl font-bold text-foreground">{value}</p>
      )}
    </div>
  )
}

// ─── Recent Order Row ─────────────────────────────────────────────────────────

function OrderRow({ order }: { order: Order }) {
  return (
    <li className="flex min-w-0 items-center justify-between gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{order.customer_name}</p>
        <p className="text-xs text-muted-foreground">{formatOrderTime(order.created_at)}</p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <OrderStatusBadge status={order.status} />
        <span className="text-sm font-semibold text-foreground">
          {formatCurrency(Number(order.total_amount))}
        </span>
      </div>
    </li>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const DashboardPage: FC = () => {
  const { data: restaurant } = useMyRestaurant()

  const { data: ordersData, isLoading: ordersLoading } = useOrders(restaurant?.id, { limit: 50 })
  const { data: productsData, isLoading: productsLoading } = useProducts(restaurant?.id)

  const stats = useMemo(() => {
    if (!ordersData) return null
    const orders = ordersData.items
    const todayOrders = orders.filter((o) => isToday(o.created_at))
    const pendingCount = orders.filter((o) => o.status === 'pending').length
    const activeProducts = productsData?.filter((p) => p.is_available).length ?? 0

    const completedAmounts = orders
      .filter((o) => o.status === 'completed')
      .map((o) => Number(o.total_amount))
    const avgTicket =
      completedAmounts.length > 0
        ? completedAmounts.reduce((a, b) => a + b, 0) / completedAmounts.length
        : 0

    return { todayCount: todayOrders.length, pendingCount, activeProducts, avgTicket }
  }, [ordersData, productsData])

  const recentOrders = ordersData?.items.slice(0, 5) ?? []
  const loading = ordersLoading || productsLoading

  if (!restaurant) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {t.dashboard.noRestaurant}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">{t.dashboard.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.dashboard.pageSubtitle}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label={t.dashboard.ordersToday}
          value={stats?.todayCount ?? 0}
          loading={loading}
        />
        <StatCard
          label={t.dashboard.ordersPending}
          value={stats?.pendingCount ?? 0}
          loading={loading}
        />
        <StatCard
          label={t.dashboard.activeProducts}
          value={stats?.activeProducts ?? 0}
          loading={productsLoading}
        />
        <StatCard
          label={t.dashboard.avgTicket}
          value={stats ? formatCurrency(stats.avgTicket) : '—'}
          loading={loading}
        />
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">{t.dashboard.recentOrders}</h2>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t.dashboard.noOrders}</p>
        ) : (
          <ul className="divide-y divide-border">
            {recentOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default DashboardPage

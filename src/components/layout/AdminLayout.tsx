import { LayoutDashboard, List, LogOut, Package, QrCode, Settings, ShoppingBag } from 'lucide-react'
import { type FC, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { t } from '@/locales/es'

interface NavItem {
  label: string
  href: string
  icon: FC<{ className?: string }>
}

const navItems: NavItem[] = [
  { label: t.nav.dashboard, href: '/admin', icon: LayoutDashboard },
  { label: t.nav.categories, href: '/admin/categories', icon: List },
  { label: t.nav.products, href: '/admin/products', icon: Package },
  { label: t.nav.orders, href: '/admin/orders', icon: ShoppingBag },
  { label: t.nav.qr, href: '/admin/qr', icon: QrCode },
  { label: t.nav.settings, href: '/admin/settings', icon: Settings },
]

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth()
  const location = useLocation()

  const isActive = (href: string) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href)

  const handleLogout = () => {
    void logout()
  }

  return (
    // h-screen: layout is viewport-contained. Body never scrolls — only main scrolls internally.
    <div className="flex h-screen bg-background">
      {/* Sidebar — desktop only */}
      <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-14 flex-shrink-0 items-center border-b border-border px-5">
          <span className="text-lg font-bold tracking-tight text-foreground">Tablio</span>
        </div>

        <nav
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
          aria-label="Navegación principal"
        >
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              ].join(' ')}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex-shrink-0 border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {t.nav.logout}
          </button>
        </div>
      </aside>

      {/*
        min-w-0: CRITICAL. Without it, the flex item's min-width is "auto" (content-based),
        which allows it to grow wider than its flex allocation, causing body-level horizontal overflow.
        min-w-0 caps the item at its allocated size so any overflow stays contained within children.
      */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Mobile header — flex-shrink-0 so it never compresses */}
        <header className="flex h-14 flex-shrink-0 items-center border-b border-border bg-card px-4 lg:hidden">
          <span className="text-lg font-bold tracking-tight text-foreground">Tablio</span>
        </header>

        {/*
          min-h-0: required so the flex item can shrink below its content height,
          enabling overflow-y-auto to create an internal scroll context.
          Without this, overflow-y-auto never triggers and the body scrolls instead.
          No pb-24 needed: the nav below is in-flow (not fixed), so no clearance required.
        */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>

        {/*
          Bottom nav — mobile only.
          In-flow (NOT fixed): sits at the bottom of the flex column.
          Always visible regardless of scroll position or viewport quirks.
          flex-shrink-0: never compresses when content is tall.
        */}
        <nav
          className="flex flex-shrink-0 border-t border-border bg-card lg:hidden"
          aria-label="Navegación móvil"
        >
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={[
                'flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                isActive(href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="w-full truncate text-center leading-tight">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default AdminLayout

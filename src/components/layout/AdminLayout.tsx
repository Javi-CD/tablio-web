import { LayoutDashboard, List, LogOut, Package, Settings, ShoppingBag } from 'lucide-react'
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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — desktop only */}
      <aside className="hidden w-56 flex-shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-14 items-center border-b border-border px-5">
          <span className="text-lg font-bold tracking-tight text-foreground">Tablio</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navegación principal">
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

        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {t.nav.logout}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-14 items-center border-b border-border bg-card px-4 lg:hidden">
          <span className="text-lg font-bold tracking-tight text-foreground">Tablio</span>
        </header>

        <main className="flex-1 overflow-auto p-4 pb-24 lg:p-6 lg:pb-6">{children}</main>

        {/* Bottom nav — mobile only */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-10 flex border-t border-border bg-card lg:hidden"
          aria-label="Navegación móvil"
        >
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={[
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                isActive(href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default AdminLayout

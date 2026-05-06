import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AdminLayout from '@/components/layout/AdminLayout'
import PrivateRoute from '@/components/layout/PrivateRoute'
import { t } from '@/locales/es'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const CategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage'))
const ProductsPage = lazy(() => import('@/pages/admin/ProductsPage'))
const OrdersPage = lazy(() => import('@/pages/admin/OrdersPage'))
const QRPage = lazy(() => import('@/pages/admin/QRPage'))
const PublicMenuPage = lazy(() => import('@/pages/public-menu/PublicMenuPage'))
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">{t.common.loading}</p>
    </div>
  )
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <AdminLayout>{children}</AdminLayout>
    </PrivateRoute>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin routes — protected + layout */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <CategoriesPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <SettingsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrdersPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/qr"
            element={
              <AdminRoute>
                <QRPage />
              </AdminRoute>
            }
          />

          {/* Public menu — no auth */}
          <Route path="/menu/:slug" element={<PublicMenuPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

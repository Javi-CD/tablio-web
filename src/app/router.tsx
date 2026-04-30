import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from '@/components/layout/AdminLayout'
import PrivateRoute from '@/components/layout/PrivateRoute'
import { t } from '@/locales/es'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const CategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage'))
const ProductsPage = lazy(() => import('@/pages/admin/ProductsPage'))

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
          {/* Public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin routes — protected + layout */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div className="flex flex-col items-start gap-2">
                  <h1 className="text-xl font-bold text-foreground">Panel de administración</h1>
                  <p className="text-sm text-muted-foreground">
                    Bienvenido a Tablio. Gestiona tu menú desde el menú lateral.
                  </p>
                </div>
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

          {/* Phase 4: /menu/:slug */}
          {/* Phase 5: /admin/orders */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

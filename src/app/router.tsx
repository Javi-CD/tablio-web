import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import PrivateRoute from '@/components/layout/PrivateRoute'
import { t } from '@/locales/es'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
// const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">{t.common.loading}</p>
    </div>
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

          {/* Admin routes — protected */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <div className="p-8">Dashboard Admin (Phase 2 Auth Ready)</div>
              </PrivateRoute>
            }
          />
          {/* 
          <Route
            path="/admin/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          */}

          {/* Phase 3: categories, products */}
          {/* Phase 4: /menu/:slug */}
          {/* Phase 5: orders */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

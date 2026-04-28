import { BrowserRouter, Route, Routes } from 'react-router-dom'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <p className="text-sm text-muted-foreground">Tablio — en construcción</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

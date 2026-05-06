# tablio-web

Tablio Frontend — Digital menu, order cart, and administrative panel for gastronomic businesses in Latam.

**Stack:** React 18 · TypeScript strict · Vite · Tailwind CSS · shadcn/ui · TanStack Query v5 · pnpm

---

## Requirements

- [Node.js 20 LTS](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation) — package manager

## Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Javi-CD/tablio-web.git
cd tablio-web

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env.local
# Edit .env.local with the corresponding values

# 4. Start the development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

Vite's proxy redirects `/api` and `/ws` to the backend at `http://localhost:8000`.
Make sure you have `tablio-api` running locally.

## Frequent commands

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Build preview
pnpm preview

# Linting
pnpm lint

# TypeScript type checking
pnpm tsc --noEmit

# Format checking
pnpm format:check

# Format files
pnpm format

# Unit and integration tests (Vitest)
pnpm test

# Tests with coverage
pnpm test:coverage

# E2E and accessibility tests (Playwright)
pnpm test:e2e
```

## Project Structure

```
src/
├── app/              # Router and global providers
├── pages/            # Pages organized by context (admin/, auth/, public-menu/)
├── components/
│   ├── ui/           # Base components from shadcn/ui
│   ├── layout/       # Sidebar, Navbar, AdminLayout
│   ├── menu/         # ProductCard, CategoryNav, Cart, QRCode
│   ├── orders/       # OrderCard, OrderStatusBadge
│   └── products/     # ProductForm, ProductTable
├── features/         # Logic by domain (api, hooks, types)
├── services/         # Base HTTP client (Axios)
├── hooks/            # Global hooks (useAuth, useWebSocket)
├── types/            # Shared types
└── utils/            # Pure utilities (formatCurrency, cn)
tests/
├── unit/             # Vitest — hooks and utilities
├── integration/      # Vitest + Testing Library — components
├── e2e/              # Playwright — full flows
└── a11y/             # axe-core + Playwright — WCAG 2.1 AA accessibility
```

## Conventions

See [CONTRIBUTING.md](CONTRIBUTING.md) for code conventions, commits, and the PR process.

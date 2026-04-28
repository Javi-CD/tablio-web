# Contribution Guide — tablio-web

This document defines the mandatory conventions for contributing to the Tablio frontend. Read completely before writing the first line of code.

---

## Branches

| Type | Pattern | Example |
|---|---|---|
| New feature | `feature/<name>` | `feature/public-menu-page` |
| Bug fix | `fix/<name>` | `fix/cart-total-display` |
| Maintenance | `chore/<name>` | `chore/update-shadcn` |
| CI/CD | `ci/<name>` | `ci/add-playwright-step` |

**Mandatory flow:** `feature/*` → `develop` → `main`

- No direct push to `main` or `develop`.
- Every change enters via a Pull Request.
- The PR to `main` requires the status checks to pass: **quality**, **test-unit**, **test-e2e**, **commit-lint**.
- The PR to `develop` requires the same checks.

---

## Commit Messages — Conventional Commits

Format: `<type>: <description in present imperative>`

| Type | When to use it |
|---|---|
| `feat` | New visible feature |
| `fix` | Bug fix |
| `refactor` | Change with no functional impact |
| `test` | Add or fix tests |
| `docs` | Documentation |
| `chore` | Dependencies, config, maintenance |
| `ci` | Changes in GitHub Actions |
| `perf` | Performance improvement |

**Valid examples:**

```
feat: add product card component with cart integration
fix: prevent double submission on order form
test: add accessibility tests for public menu page
chore: add shadcn button and input components
```

---

## TypeScript / React Code Conventions

- **Package manager:** `pnpm` — never use `npm` or `yarn`.
- **TypeScript:** `strict: true` in `tsconfig.json`. `any` is not used. `@ts-ignore` is not used without an explanatory comment.
- **Components:** Functional only. No class components.
- **Props:** Typed with `interface` (not `type` for component props).
- **Naming:**
  - `PascalCase` for React components, types, and interfaces.
  - `camelCase` for functions, variables, and hooks.
  - `UPPER_SNAKE_CASE` for environment constants.
- **Files:** One main component per file. The file name matches the exported component (`ProductCard.tsx` → `export default ProductCard`).
- **Imports:** Use `@/` alias instead of relative paths that go up more than one level. Example: `@/utils/formatCurrency` instead of `../../utils/formatCurrency`.
- **JavaScript:** ES6+ strictly. Arrow functions, destructuring, async/await, optional chaining (`?.`), nullish coalescing (`??`), template literals.

---

## Mobile-first — Mandatory Rule

The public menu is used by end customers from their phones. The entire UI is designed from **375px** upwards.

- Tailwind classes go first without prefix (mobile), then `sm:`, `md:`, `lg:` for larger screens.
- Never use `hover:` as the sole action indicator — touch devices have no hover.
- Buttons and touch areas with a minimum height of **44px**.
- Minimum typography of **16px** in form fields (prevents automatic zoom on iOS).
- Test the public menu in Chrome DevTools iPhone SE mode (375px) before any merge.

---

## Accessibility — WCAG 2.1 AA

The entire interface complies with WCAG 2.1 level AA:

- Minimum contrast 4.5:1 for normal text, 3:1 for large text.
- All functionality accessible by keyboard.
- Images with descriptive `alt`.
- Forms with explicit `<label>` associated with each input.
- Error messages announced to screen readers.
- Visible focus indicators on all interactive elements.
- `eslint-plugin-jsx-a11y` enabled — accessibility errors in JSX are lint errors.

---

## API Error Handling

The API returns errors with `detail` (English) and `code` (semantic) fields. The frontend **never** shows the `detail` field directly to the user. Use the `code` field to look up the translated message in `src/locales/errors.ts`.

```typescript
// Correct
import { getErrorMessage } from '@/locales/errors'
toast.error(getErrorMessage(error.code))

// Incorrect — never show the raw API detail
toast.error(error.detail)
```

---

## Testing

- Tests are written in the **same phase** as the production code.
- **Types of tests:**
  - `tests/unit/` — Vitest: custom hooks and pure utilities. No DOM.
  - `tests/integration/` — Vitest + Testing Library: rendered components with mocked data.
  - `tests/e2e/` — Playwright: full flows in a real browser.
  - `tests/a11y/` — axe-core + Playwright: WCAG 2.1 AA on main pages.
- Integration and E2E tests focus on behavior from the user's perspective (queries by role, visible text, not by CSS class or internal ID).

---

## Checklist Before Opening a PR

- [ ] `pnpm lint` passes without errors
- [ ] `pnpm tsc --noEmit` passes without errors
- [ ] `pnpm format:check` reports no differences
- [ ] `pnpm test:coverage` passes
- [ ] `pnpm test:e2e` passes
- [ ] The public menu was checked in Chrome DevTools iPhone SE mode (375px)
- [ ] There are no axe-core level AA violations on the modified pages
- [ ] The commit message follows Conventional Commits
- [ ] The branch comes from `develop`, not `main`
- [ ] There is no real `.env` or credentials committed

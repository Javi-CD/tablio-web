import { CheckCircle, ChevronLeft, Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { type ChangeEvent, type FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCreateOrder } from '@/features/orders/hooks'
import type { OrderType } from '@/features/orders/types'
import { usePublicMenu } from '@/features/public-menu/hooks'
import type { PublicCategory, PublicProduct } from '@/features/public-menu/types'
import { t } from '@/locales/es'
import { useCart } from '@/store/useCart'
import { formatCurrency } from '@/utils/formatCurrency'

// ─── Loading / Error screens ─────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">{t.menu.loading}</p>
    </div>
  )
}

function NotFoundScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <p className="text-lg font-semibold text-foreground">{t.menu.notFound}</p>
      <p className="text-sm text-muted-foreground">{t.menu.notFoundMessage}</p>
    </div>
  )
}

// ─── Restaurant Header ────────────────────────────────────────────────────────

interface RestaurantHeaderProps {
  name: string
  description: string | null
  logo_url: string | null
}

function RestaurantHeader({ name, description, logo_url }: RestaurantHeaderProps) {
  return (
    <header className="bg-card px-4 pb-5 pt-6 text-center shadow-sm">
      {logo_url && (
        <img
          src={logo_url}
          alt={`Logo de ${name}`}
          className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
        />
      )}
      <h1 className="text-xl font-bold text-foreground">{name}</h1>
      {description && (
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
    </header>
  )
}

// ─── Category Nav ─────────────────────────────────────────────────────────────

interface CategoryNavProps {
  categories: PublicCategory[]
  activeId: string
}

function CategoryNav({ categories, activeId }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`category-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (!activeId || !scrollRef.current) return
    const btn = scrollRef.current.querySelector<HTMLElement>(`[data-cat="${activeId}"]`)
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeId])

  return (
    <nav
      aria-label="Categorías del menú"
      className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur"
    >
      <div
        ref={scrollRef}
        className="scrollbar-none flex gap-1 overflow-x-auto px-3 py-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            data-cat={cat.id}
            onClick={() => scrollToCategory(cat.id)}
            aria-current={activeId === cat.id ? 'true' : undefined}
            className={[
              'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeId === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            ].join(' ')}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: PublicProduct
}

function ProductCard({ product }: ProductCardProps) {
  const { add, getQuantity, setQuantity } = useCart()
  const qty = getQuantity(product.id)

  const handleAdd = () => {
    add({
      productId: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
  }

  return (
    <article className="flex items-start gap-3 border-b border-border px-4 py-4 last:border-b-0">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm font-semibold leading-snug text-foreground">{product.name}</p>
        {product.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}
        <p className="mt-1 text-sm font-bold text-foreground">
          {formatCurrency(Number(product.price))}
        </p>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end gap-2">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-20 w-20 rounded-xl object-cover"
            loading="lazy"
          />
        )}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            aria-label={`Agregar ${product.name} al pedido`}
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            {t.menu.addToCart}
          </button>
        ) : (
          <div
            className="flex items-center gap-2 rounded-full border border-primary px-2 py-1"
            role="group"
            aria-label={`Cantidad de ${product.name}`}
          >
            <button
              onClick={() => setQuantity(product.id, qty - 1)}
              aria-label="Reducir cantidad"
              className="flex h-6 w-6 items-center justify-center rounded-full text-primary hover:bg-primary/10"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-4 text-center text-sm font-semibold text-foreground">{qty}</span>
            <button
              onClick={() => setQuantity(product.id, qty + 1)}
              aria-label="Aumentar cantidad"
              className="flex h-6 w-6 items-center justify-center rounded-full text-primary hover:bg-primary/10"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

// ─── Category Section ─────────────────────────────────────────────────────────

interface CategorySectionProps {
  category: PublicCategory
}

function CategorySection({ category }: CategorySectionProps) {
  return (
    <section id={`category-${category.id}`} aria-labelledby={`heading-${category.id}`}>
      <div className="bg-muted/40 px-4 py-2">
        <h2 id={`heading-${category.id}`} className="text-sm font-semibold text-foreground">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{category.description}</p>
        )}
      </div>
      {category.products.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">{t.menu.emptyMenu}</p>
      ) : (
        <div className="bg-card">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

// ─── Cart Fab ─────────────────────────────────────────────────────────────────

interface CartFabProps {
  itemCount: number
  total: number
  onClick: () => void
}

function CartFab({ itemCount, total, onClick }: CartFabProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 p-4">
      <button
        onClick={onClick}
        aria-label={`Ver pedido: ${itemCount} productos, total ${formatCurrency(total)}`}
        className="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-lg hover:opacity-95"
      >
        <span className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" aria-hidden />
          <span className="text-sm font-semibold">{t.menu.cart}</span>
        </span>
        <span className="flex items-center gap-3">
          <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-bold">
            {itemCount}
          </span>
          <span className="text-sm font-bold">{formatCurrency(total)}</span>
        </span>
      </button>
    </div>
  )
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

type DrawerStep = 'cart' | 'checkout' | 'confirmed'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  slug: string
}

function CartDrawer({ open, onClose, slug }: CartDrawerProps) {
  const { items, total, setQuantity, clear } = useCart()
  const createOrderMut = useCreateOrder(slug)

  const [step, setStep] = useState<DrawerStep>('cart')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [orderType, setOrderType] = useState<OrderType>('table')
  const [tableNum, setTableNum] = useState('')
  const [nameError, setNameError] = useState('')
  const [tableError, setTableError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [confirmedId, setConfirmedId] = useState('')

  useEffect(() => {
    if (open) {
      setStep('cart')
      setNameError('')
      setTableError('')
      setSubmitError('')
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async () => {
    setNameError('')
    setTableError('')
    setSubmitError('')

    let valid = true
    if (!customerName.trim()) {
      setNameError(t.checkout.nameRequired)
      valid = false
    }
    if (orderType === 'table' && !tableNum.trim()) {
      setTableError(t.checkout.tableRequired)
      valid = false
    }
    if (!valid) return

    try {
      const order = await createOrderMut.mutateAsync({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim() || null,
        customer_notes: notes.trim() || null,
        order_type: orderType,
        table_number: orderType === 'table' ? tableNum.trim() : null,
        items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
      })
      setConfirmedId(order.id)
      clear()
      setStep('confirmed')
    } catch {
      setSubmitError(t.checkout.submitError)
    }
  }

  // ── Step: confirmed ────────────────────────────────────────────────────────
  if (step === 'confirmed') {
    return (
      <div
        className="fixed inset-0 z-30 flex flex-col justify-end"
        role="dialog"
        aria-modal="true"
        aria-label={t.checkout.confirmationTitle}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
        <div className="relative max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-card shadow-2xl">
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <CheckCircle className="mb-4 h-14 w-14 text-green-500" aria-hidden />
            <h2 className="text-xl font-bold text-foreground">{t.checkout.confirmationTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.checkout.confirmationMessage}</p>
            <div className="mt-5 rounded-xl bg-muted px-6 py-4">
              <p className="text-xs text-muted-foreground">{t.checkout.confirmationOrderCode}</p>
              <p className="mt-1 text-2xl font-bold tracking-widest text-foreground">
                #{confirmedId.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-8 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {t.checkout.closeButton}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step: checkout ─────────────────────────────────────────────────────────
  if (step === 'checkout') {
    return (
      <div
        className="fixed inset-0 z-30 flex flex-col justify-end"
        role="dialog"
        aria-modal="true"
        aria-label={t.checkout.title}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
        <div className="relative max-h-[92dvh] overflow-y-auto rounded-t-2xl bg-card shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 flex items-center gap-3 border-b border-border bg-card px-4 py-4">
            <button
              onClick={() => setStep('cart')}
              aria-label={t.checkout.backButton}
              className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-base font-semibold text-foreground">{t.checkout.title}</h2>
          </div>

          <div className="space-y-4 px-4 py-4">
            {/* Customer name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="co-name">
                {t.checkout.customerNameLabel}
              </label>
              <input
                id="co-name"
                type="text"
                value={customerName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                placeholder={t.checkout.customerNamePlaceholder}
                autoComplete="name"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'co-name-error' : undefined}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {nameError && (
                <p
                  id="co-name-error"
                  role="alert"
                  className="mt-1 text-xs font-medium text-red-700"
                >
                  {nameError}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="co-phone">
                {t.checkout.customerPhoneLabel}
              </label>
              <input
                id="co-phone"
                type="tel"
                value={customerPhone}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value)}
                placeholder={t.checkout.customerPhonePlaceholder}
                autoComplete="tel"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Order type */}
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                {t.checkout.orderTypeLabel}
              </p>
              <div className="flex gap-2">
                {[
                  { value: 'table' as OrderType, label: t.checkout.orderTypeTable },
                  { value: 'pickup' as OrderType, label: t.checkout.orderTypePickup },
                  { value: 'delivery' as OrderType, label: t.checkout.orderTypeDelivery },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setOrderType(value)}
                    aria-pressed={orderType === value}
                    className={[
                      'flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors',
                      orderType === value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input bg-background text-foreground hover:bg-accent',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table number */}
            {orderType === 'table' && (
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-foreground"
                  htmlFor="co-table"
                >
                  {t.checkout.tableNumberLabel}
                </label>
                <input
                  id="co-table"
                  type="text"
                  inputMode="numeric"
                  value={tableNum}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTableNum(e.target.value)}
                  placeholder={t.checkout.tableNumberPlaceholder}
                  aria-invalid={!!tableError}
                  aria-describedby={tableError ? 'co-table-error' : undefined}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {tableError && (
                  <p
                    id="co-table-error"
                    role="alert"
                    className="mt-1 text-xs font-medium text-red-700"
                  >
                    {tableError}
                  </p>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="co-notes">
                {t.checkout.notesLabel}
              </label>
              <textarea
                id="co-notes"
                value={notes}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                placeholder={t.checkout.notesPlaceholder}
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Order summary */}
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.productId} className="flex items-center justify-between py-2">
                    <span className="text-sm text-foreground">
                      <span className="font-semibold">{item.quantity}×</span> {item.name}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <span className="text-sm font-semibold text-foreground">{t.menu.total}</span>
                <span className="text-base font-bold text-foreground">{formatCurrency(total)}</span>
              </div>
            </div>

            {submitError && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800"
              >
                {submitError}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-border bg-card px-4 py-4">
            <button
              onClick={() => {
                void handleSubmit()
              }}
              disabled={createOrderMut.isPending}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {createOrderMut.isPending ? t.checkout.submitting : t.checkout.submitButton}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step: cart ─────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-30 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={t.menu.cart}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-card shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-4 py-4">
          <h2 className="text-base font-semibold text-foreground">{t.menu.cart}</h2>
          <button
            onClick={onClose}
            aria-label={t.menu.close}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm font-medium text-foreground">{t.menu.cartEmpty}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.menu.cartEmptyHint}</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3 px-4 py-3">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(Number(item.price))}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-full border border-border px-2 py-1"
                    role="group"
                    aria-label={`Cantidad de ${item.name}`}
                  >
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      aria-label="Reducir cantidad"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center text-sm font-semibold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      aria-label="Aumentar cantidad"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="w-16 text-right text-sm font-semibold text-foreground">
                    {formatCurrency(Number(item.price) * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-border bg-card px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{t.menu.total}</span>
                <span className="text-base font-bold text-foreground">{formatCurrency(total)}</span>
              </div>
              <button
                onClick={clear}
                className="mb-2 w-full rounded-lg border border-input py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                {t.menu.clearCart}
              </button>
              <button
                onClick={() => setStep('checkout')}
                className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                {t.menu.checkout}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PublicMenuPage: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, isError } = usePublicMenu(slug ?? '')
  const { itemCount, total } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('')

  useEffect(() => {
    const cats = data?.categories
    if (!cats || cats.length === 0) return

    const observers: IntersectionObserver[] = []
    cats.forEach((cat) => {
      const el = document.getElementById(`category-${cat.id}`)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveCategory(cat.id)
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [data?.categories])

  if (isLoading) return <LoadingScreen />
  if (isError || !data) return <NotFoundScreen />

  const { restaurant, categories } = data

  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeader
        name={restaurant.name}
        description={restaurant.description}
        logo_url={restaurant.logo_url}
      />

      {categories.length > 0 && <CategoryNav categories={categories} activeId={activeCategory} />}

      <main className={itemCount > 0 ? 'pb-28' : 'pb-8'}>
        {categories.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-muted-foreground">{t.menu.emptyMenu}</p>
        ) : (
          categories.map((cat) => <CategorySection key={cat.id} category={cat} />)
        )}
      </main>

      {itemCount > 0 && (
        <CartFab itemCount={itemCount} total={total} onClick={() => setCartOpen(true)} />
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} slug={slug ?? ''} />
    </div>
  )
}

export default PublicMenuPage

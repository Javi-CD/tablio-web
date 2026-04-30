import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { type FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useCategories } from '@/features/categories/hooks'
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from '@/features/products/hooks'
import type { Product } from '@/features/products/types'
import { useMyRestaurant } from '@/features/restaurants/hooks'
import { getAxiosErrorMessage } from '@/locales/errors'
import { t } from '@/locales/es'
import { formatCurrency } from '@/utils/formatCurrency'

const schema = z.object({
  name: z.string().min(1, t.common.required),
  price: z
    .string()
    .min(1, t.common.required)
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Ingresa un precio válido mayor a 0'),
  description: z.string().optional(),
  image_url: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/.test(v), 'Debe ser una URL válida (http/https)'),
  category_id: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

// ─── Dialog ──────────────────────────────────────────────────────────────────

interface DialogProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

function Dialog({ title, onClose, children }: DialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prod-dialog-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="prod-dialog-title" className="text-base font-semibold text-foreground">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Image Preview ────────────────────────────────────────────────────────────

interface ImagePreviewProps {
  url: string
}

function ImagePreview({ url }: ImagePreviewProps) {
  const [valid, setValid] = useState(false)

  useEffect(() => {
    setValid(false)
    if (!url || !/^https?:\/\/.+/.test(url)) return
    const img = new Image()
    img.onload = () => setValid(true)
    img.onerror = () => setValid(false)
    img.src = url
  }, [url])

  if (!valid) return null

  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-border">
      <img src={url} alt={t.product.imagePreview} className="h-32 w-full object-cover" />
    </div>
  )
}

// ─── Product Form ─────────────────────────────────────────────────────────────

interface ProductFormProps {
  defaultValues?: Partial<FormValues>
  restaurantId: string
  onSubmit: (values: FormValues) => Promise<void>
  isPending: boolean
  onCancel: () => void
}

function ProductForm({
  defaultValues,
  restaurantId,
  onSubmit,
  isPending,
  onCancel,
}: ProductFormProps) {
  const { data: categories } = useCategories(restaurantId)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { price: '', category_id: '', ...defaultValues },
  })

  const imageUrl = watch('image_url') ?? ''

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values)
    } catch (err) {
      setError('root', { message: getAxiosErrorMessage(err) })
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)} noValidate className="space-y-4">
      <Field label={t.product.nameLabel} id="prod-name" error={errors.name?.message}>
        <input
          id="prod-name"
          type="text"
          className={inputCls(!!errors.name)}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
      </Field>

      <Field label={t.product.priceLabel} id="prod-price" error={errors.price?.message}>
        <input
          id="prod-price"
          type="number"
          min="1"
          step="any"
          className={inputCls(!!errors.price)}
          aria-invalid={!!errors.price}
          {...register('price')}
        />
      </Field>

      <Field
        label={t.product.descriptionLabel}
        id="prod-description"
        error={errors.description?.message}
      >
        <textarea
          id="prod-description"
          rows={2}
          className={inputCls(false) + ' resize-none'}
          {...register('description')}
        />
      </Field>

      <Field label={t.product.imageUrlLabel} id="prod-image-url" error={errors.image_url?.message}>
        <input
          id="prod-image-url"
          type="url"
          placeholder={t.product.imageUrlPlaceholder}
          className={inputCls(!!errors.image_url)}
          aria-invalid={!!errors.image_url}
          {...register('image_url')}
        />
        <ImagePreview url={imageUrl} />
      </Field>

      <Field label={t.product.categoryLabel} id="prod-category" error={errors.category_id?.message}>
        <select id="prod-category" className={inputCls(false)} {...register('category_id')}>
          <option value="">{t.product.categoryNone}</option>
          {(categories ?? [])
            .filter((c) => c.is_active)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </Field>

      {errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
        >
          {t.product.cancelButton}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? t.product.saving : t.product.saveButton}
        </button>
      </div>
    </form>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

interface DeleteConfirmProps {
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}

function DeleteConfirm({ onConfirm, onCancel, isPending }: DeleteConfirmProps) {
  return (
    <Dialog title={t.product.deleteConfirmTitle} onClose={onCancel}>
      <p className="mb-6 text-sm text-muted-foreground">{t.product.deleteConfirmMessage}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
        >
          {t.product.cancelButton}
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? t.product.deleting : t.product.deleteButton}
        </button>
      </div>
    </Dialog>
  )
}

// ─── Availability Toggle ──────────────────────────────────────────────────────

interface AvailabilityToggleProps {
  product: Product
  onToggle: (product: Product) => void
  isPending: boolean
}

function AvailabilityToggle({ product, onToggle, isPending }: AvailabilityToggleProps) {
  return (
    <button
      onClick={() => onToggle(product)}
      disabled={isPending}
      className={[
        'rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50',
        product.is_available
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-muted text-muted-foreground hover:bg-muted/80',
      ].join(' ')}
      aria-label={
        product.is_available
          ? `Marcar ${product.name} como no disponible`
          : `Marcar ${product.name} como disponible`
      }
    >
      {product.is_available ? t.product.available : t.product.unavailable}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; product: Product }
  | { type: 'delete'; product: Product }

const ProductsPage: FC = () => {
  const { data: restaurant } = useMyRestaurant()
  const restaurantId = restaurant?.id ?? ''

  const { data: products, isLoading } = useProducts(restaurant?.id)
  const { data: categories } = useCategories(restaurant?.id)
  const createMutation = useCreateProduct(restaurantId)
  const updateMutation = useUpdateProduct(restaurantId)
  const deleteMutation = useDeleteProduct(restaurantId)

  const [modal, setModal] = useState<ModalState>({ type: 'closed' })
  const [successMsg, setSuccessMsg] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    if (!successMsg) return
    const timer = setTimeout(() => setSuccessMsg(''), 3000)
    return () => clearTimeout(timer)
  }, [successMsg])

  const closeModal = () => setModal({ type: 'closed' })

  const categoryName = (id: string | null) =>
    id ? (categories?.find((c) => c.id === id)?.name ?? '—') : '—'

  const handleCreate = async (values: FormValues) => {
    await createMutation.mutateAsync({
      name: values.name,
      price: values.price,
      description: values.description || null,
      image_url: values.image_url || null,
      category_id: values.category_id || null,
    })
    setSuccessMsg(t.product.createdSuccess)
    closeModal()
  }

  const handleUpdate = async (values: FormValues) => {
    if (modal.type !== 'edit') return
    await updateMutation.mutateAsync({
      id: modal.product.id,
      data: {
        name: values.name,
        price: values.price,
        description: values.description || null,
        image_url: values.image_url || null,
        category_id: values.category_id || null,
      },
    })
    setSuccessMsg(t.product.updatedSuccess)
    closeModal()
  }

  const handleDelete = async () => {
    if (modal.type !== 'delete') return
    await deleteMutation.mutateAsync(modal.product.id)
    setSuccessMsg(t.product.deletedSuccess)
    closeModal()
  }

  const handleToggleAvailability = async (product: Product) => {
    setTogglingId(product.id)
    try {
      await updateMutation.mutateAsync({
        id: product.id,
        data: { is_available: !product.is_available },
      })
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t.product.pageTitle}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{t.product.pageSubtitle}</p>
        </div>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t.product.newButton}</span>
        </button>
      </div>

      {successMsg && (
        <p role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          {successMsg}
        </p>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">{t.common.loading}</p>}

      {!isLoading && products && products.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">{t.product.emptyState}</p>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            {t.product.newButton}
          </button>
        </div>
      )}

      {products && products.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Desktop table */}
          <table className="hidden w-full text-sm md:table">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t.product.nameLabel}
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t.product.categoryLabel}
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  {t.product.priceLabel}
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image_url && (
                        <img
                          src={p.image_url}
                          alt=""
                          className="h-9 w-9 flex-shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{p.name}</p>
                        {p.description && (
                          <p className="truncate text-xs text-muted-foreground">{p.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{categoryName(p.category_id)}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    {formatCurrency(Number(p.price))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <AvailabilityToggle
                      product={p}
                      onToggle={(prod) => void handleToggleAvailability(prod)}
                      isPending={togglingId === p.id}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setModal({ type: 'edit', product: p })}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        aria-label={`Editar ${p.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setModal({ type: 'delete', product: p })}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Eliminar ${p.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile card list */}
          <ul className="divide-y divide-border md:hidden">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt=""
                    className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-muted" aria-hidden />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(Number(p.price))}</p>
                  <div className="mt-1">
                    <AvailabilityToggle
                      product={p}
                      onToggle={(prod) => void handleToggleAvailability(prod)}
                      isPending={togglingId === p.id}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setModal({ type: 'edit', product: p })}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
                    aria-label={`Editar ${p.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setModal({ type: 'delete', product: p })}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Eliminar ${p.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create modal */}
      {modal.type === 'create' && (
        <Dialog title={t.product.createTitle} onClose={closeModal}>
          <ProductForm
            restaurantId={restaurantId}
            onSubmit={handleCreate}
            isPending={createMutation.isPending}
            onCancel={closeModal}
          />
        </Dialog>
      )}

      {/* Edit modal */}
      {modal.type === 'edit' && (
        <Dialog title={t.product.editTitle} onClose={closeModal}>
          <ProductForm
            restaurantId={restaurantId}
            defaultValues={{
              name: modal.product.name,
              price: modal.product.price,
              description: modal.product.description ?? '',
              image_url: modal.product.image_url ?? '',
              category_id: modal.product.category_id ?? '',
            }}
            onSubmit={handleUpdate}
            isPending={updateMutation.isPending}
            onCancel={closeModal}
          />
        </Dialog>
      )}

      {/* Delete confirm */}
      {modal.type === 'delete' && (
        <DeleteConfirm
          onConfirm={() => void handleDelete()}
          onCancel={closeModal}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  )
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string
  id: string
  error?: string
  children: React.ReactNode
}

function Field({ label, id, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function inputCls(invalid: boolean) {
  return [
    'w-full rounded-lg border bg-background px-3 py-2.5 text-base text-foreground',
    'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
    invalid ? 'border-destructive' : 'border-input',
  ].join(' ')
}

export default ProductsPage

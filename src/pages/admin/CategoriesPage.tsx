import { zodResolver } from '@hookform/resolvers/zod'
import { GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react'
import { type FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Skeleton } from '@/components/ui/Skeleton'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/features/categories/hooks'
import type { Category } from '@/features/categories/types'
import { useMyRestaurant } from '@/features/restaurants/hooks'
import { getAxiosErrorMessage } from '@/locales/errors'
import { t } from '@/locales/es'

const schema = z.object({
  name: z.string().min(1, t.common.required),
  description: z.string().optional(),
  sort_order: z.coerce.number().int().min(0),
})

type FormValues = z.infer<typeof schema>

// ─── Dialog ─────────────────────────────────────────────────────────────────

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
      aria-labelledby="dialog-title"
    >
      <div className="w-full max-w-md rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="dialog-title" className="text-base font-semibold text-foreground">
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

// ─── Category Form ───────────────────────────────────────────────────────────

interface CategoryFormProps {
  defaultValues?: Partial<FormValues>
  onSubmit: (values: FormValues) => Promise<void>
  isPending: boolean
  onCancel: () => void
}

function CategoryForm({ defaultValues, onSubmit, isPending, onCancel }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { sort_order: 0, ...defaultValues },
  })

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values)
    } catch (err) {
      setError('root', { message: getAxiosErrorMessage(err) })
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)} noValidate className="space-y-4">
      <Field label={t.category.nameLabel} id="cat-name" error={errors.name?.message}>
        <input
          id="cat-name"
          type="text"
          className={inputCls(!!errors.name)}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
      </Field>

      <Field
        label={t.category.descriptionLabel}
        id="cat-description"
        error={errors.description?.message}
      >
        <textarea
          id="cat-description"
          rows={2}
          className={inputCls(false) + ' resize-none'}
          {...register('description')}
        />
      </Field>

      <Field
        label={t.category.sortOrderLabel}
        id="cat-sort-order"
        error={errors.sort_order?.message}
      >
        <input
          id="cat-sort-order"
          type="number"
          min={0}
          className={inputCls(!!errors.sort_order)}
          aria-invalid={!!errors.sort_order}
          {...register('sort_order')}
        />
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
          {t.category.cancelButton}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? t.category.saving : t.category.saveButton}
        </button>
      </div>
    </form>
  )
}

// ─── Delete Confirm ──────────────────────────────────────────────────────────

interface DeleteConfirmProps {
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}

function DeleteConfirm({ onConfirm, onCancel, isPending }: DeleteConfirmProps) {
  return (
    <Dialog title={t.category.deleteConfirmTitle} onClose={onCancel}>
      <p className="mb-6 text-sm text-muted-foreground">{t.category.deleteConfirmMessage}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
        >
          {t.category.cancelButton}
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? t.category.deleting : t.category.deleteButton}
        </button>
      </div>
    </Dialog>
  )
}

// ─── Category Row ────────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

function CategoryRow({ category, onEdit, onDelete }: CategoryRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <GripVertical className="h-4 w-4 flex-shrink-0 text-muted-foreground/50" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">{category.name}</span>
        {category.description && (
          <span className="truncate text-xs text-muted-foreground">{category.description}</span>
        )}
      </div>
      <span
        className={[
          'rounded-full px-2 py-0.5 text-xs font-medium',
          category.is_active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground',
        ].join(' ')}
      >
        {category.is_active ? t.category.active : t.category.inactive}
      </span>
      <button
        onClick={() => onEdit(category)}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        aria-label={`Editar ${category.name}`}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={() => onDelete(category)}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Eliminar ${category.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; category: Category }
  | { type: 'delete'; category: Category }

const CategoriesPage: FC = () => {
  const { data: restaurant } = useMyRestaurant()
  const restaurantId = restaurant?.id ?? ''

  const { data: categories, isLoading } = useCategories(restaurant?.id)
  const createMutation = useCreateCategory(restaurantId)
  const updateMutation = useUpdateCategory(restaurantId)
  const deleteMutation = useDeleteCategory(restaurantId)

  const [modal, setModal] = useState<ModalState>({ type: 'closed' })
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (!successMsg) return
    const timer = setTimeout(() => setSuccessMsg(''), 3000)
    return () => clearTimeout(timer)
  }, [successMsg])

  const closeModal = () => setModal({ type: 'closed' })

  const handleCreate = async (values: FormValues) => {
    await createMutation.mutateAsync({
      name: values.name,
      description: values.description || null,
      sort_order: values.sort_order,
    })
    setSuccessMsg(t.category.createdSuccess)
    closeModal()
  }

  const handleUpdate = async (values: FormValues) => {
    if (modal.type !== 'edit') return
    await updateMutation.mutateAsync({
      id: modal.category.id,
      data: {
        name: values.name,
        description: values.description || null,
        sort_order: values.sort_order,
      },
    })
    setSuccessMsg(t.category.updatedSuccess)
    closeModal()
  }

  const handleDelete = async () => {
    if (modal.type !== 'delete') return
    await deleteMutation.mutateAsync(modal.category.id)
    setSuccessMsg(t.category.deletedSuccess)
    closeModal()
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t.category.pageTitle}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{t.category.pageSubtitle}</p>
        </div>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t.category.newButton}</span>
        </button>
      </div>

      {successMsg && (
        <p role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          {successMsg}
        </p>
      )}

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && categories && categories.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">{t.category.emptyState}</p>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            {t.category.newButton}
          </button>
        </div>
      )}

      {categories && categories.length > 0 && (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <CategoryRow
              key={cat.id}
              category={cat}
              onEdit={(c) => setModal({ type: 'edit', category: c })}
              onDelete={(c) => setModal({ type: 'delete', category: c })}
            />
          ))}
        </ul>
      )}

      {/* Create modal */}
      {modal.type === 'create' && (
        <Dialog title={t.category.createTitle} onClose={closeModal}>
          <CategoryForm
            onSubmit={handleCreate}
            isPending={createMutation.isPending}
            onCancel={closeModal}
          />
        </Dialog>
      )}

      {/* Edit modal */}
      {modal.type === 'edit' && (
        <Dialog title={t.category.editTitle} onClose={closeModal}>
          <CategoryForm
            defaultValues={{
              name: modal.category.name,
              description: modal.category.description ?? '',
              sort_order: modal.category.sort_order,
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

// ─── Shared helpers ──────────────────────────────────────────────────────────

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

export default CategoriesPage

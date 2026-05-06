import { zodResolver } from '@hookform/resolvers/zod'
import { type FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Skeleton } from '@/components/ui/Skeleton'
import {
  useMyRestaurant,
  useCreateRestaurant,
  useUpdateRestaurant,
} from '@/features/restaurants/hooks'
import { getAxiosErrorMessage } from '@/locales/errors'
import { t } from '@/locales/es'

const schema = z.object({
  name: z.string().min(1, t.common.required),
  slug: z.string().min(1, t.common.required).optional().or(z.literal('')),
  description: z.string().optional(),
  logo_url: z.string().url('URL inválida').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const SettingsPage: FC = () => {
  const { data: restaurant, isLoading } = useMyRestaurant()
  const createMutation = useCreateRestaurant()
  const updateMutation = useUpdateRestaurant(restaurant?.id ?? '')
  const [successMsg, setSuccessMsg] = useState('')
  const [slugWarning, setSlugWarning] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (restaurant) {
      reset({
        name: restaurant.name,
        slug: restaurant.slug,
        description: restaurant.description ?? '',
        logo_url: restaurant.logo_url ?? '',
        phone: restaurant.phone ?? '',
        address: restaurant.address ?? '',
      })
    }
  }, [restaurant, reset])

  const watchedSlug = watch('slug')
  useEffect(() => {
    if (restaurant && watchedSlug !== restaurant.slug && watchedSlug) {
      setSlugWarning(true)
    } else {
      setSlugWarning(false)
    }
  }, [watchedSlug, restaurant])

  const onSubmit = async (values: FormValues) => {
    setSuccessMsg('')
    try {
      if (restaurant) {
        const update: Record<string, string | null | undefined> = {
          name: values.name,
          description: values.description || null,
          logo_url: values.logo_url || null,
          phone: values.phone || null,
          address: values.address || null,
        }
        if (values.slug && values.slug !== restaurant.slug) {
          update.slug = values.slug
        }
        await updateMutation.mutateAsync(update)
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          description: values.description || null,
          logo_url: values.logo_url || null,
          phone: values.phone || null,
          address: values.address || null,
        })
      }
      setSuccessMsg(t.restaurant.savedSuccess)
    } catch (err) {
      setError('root', { message: getAxiosErrorMessage(err) })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="mt-2 flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-xl font-bold text-foreground">{t.restaurant.settingsTitle}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.restaurant.settingsSubtitle}</p>

      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate className="mt-6 space-y-5">
        <Field label={t.restaurant.nameLabel} id="name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            className={inputCls(!!errors.name)}
            aria-invalid={!!errors.name}
            {...register('name')}
          />
        </Field>

        {restaurant && (
          <div>
            <Field label={t.restaurant.slugLabel} id="slug" error={errors.slug?.message}>
              <input
                id="slug"
                type="text"
                className={inputCls(!!errors.slug)}
                aria-invalid={!!errors.slug}
                {...register('slug')}
              />
            </Field>
            {slugWarning && (
              <p role="alert" className="mt-1 text-xs text-amber-600">
                ⚠ {t.restaurant.slugWarning}
              </p>
            )}
          </div>
        )}

        <Field
          label={t.restaurant.descriptionLabel}
          id="description"
          error={errors.description?.message}
        >
          <textarea
            id="description"
            rows={3}
            className={inputCls(false) + ' resize-none'}
            {...register('description')}
          />
        </Field>

        <Field label={t.restaurant.logoUrlLabel} id="logo_url" error={errors.logo_url?.message}>
          <input
            id="logo_url"
            type="url"
            className={inputCls(!!errors.logo_url)}
            aria-invalid={!!errors.logo_url}
            {...register('logo_url')}
          />
        </Field>

        <Field label={t.restaurant.phoneLabel} id="phone" error={errors.phone?.message}>
          <input id="phone" type="tel" className={inputCls(false)} {...register('phone')} />
        </Field>

        <Field label={t.restaurant.addressLabel} id="address" error={errors.address?.message}>
          <input id="address" type="text" className={inputCls(false)} {...register('address')} />
        </Field>

        {errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        {successMsg && (
          <p role="status" className="text-sm text-green-600">
            {successMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="min-h-[44px] w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending
            ? restaurant
              ? t.restaurant.saving
              : t.restaurant.creating
            : restaurant
              ? t.restaurant.saveButton
              : t.restaurant.createButton}
        </button>
      </form>
    </div>
  )
}

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

export default SettingsPage

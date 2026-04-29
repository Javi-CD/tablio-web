import { zodResolver } from '@hookform/resolvers/zod'
import { type FC } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { z } from 'zod'

import { useLogin } from '@/features/auth/hooks'
import { getAxiosErrorMessage } from '@/locales/errors'
import { t } from '@/locales/es'

const schema = z.object({
  email: z.string().email(t.common.invalidEmail),
  password: z.string().min(1, t.common.required),
})

type FormValues = z.infer<typeof schema>

const LoginPage: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin'
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      await loginMutation.mutateAsync(values)
      navigate(from, { replace: true })
    } catch (err) {
      setError('root', { message: getAxiosErrorMessage(err) })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t.auth.loginTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.auth.loginSubtitle}</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
              {t.auth.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
              {t.auth.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p role="alert" className="text-sm text-destructive">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="min-h-[44px] w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loginMutation.isPending ? t.auth.loggingIn : t.auth.loginButton}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.noAccount}{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            {t.auth.registerLink}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

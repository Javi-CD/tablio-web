import { type FC } from 'react'
import { Link } from 'react-router-dom'

import { t } from '@/locales/es'

const NotFoundPage: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-xl font-bold text-foreground">{t.notFound.title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{t.notFound.message}</p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
      >
        {t.notFound.backHome}
      </Link>
    </div>
  )
}

export default NotFoundPage

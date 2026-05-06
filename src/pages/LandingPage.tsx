import { type FC } from 'react'
import { Link } from 'react-router-dom'

import { t } from '@/locales/es'

// ─── Landing Page ─────────────────────────────────────────────────────────────

const DEMO_SLUG = 'demo'

const STEPS = [
  { title: t.landing.step1Title, desc: t.landing.step1Desc, num: '1' },
  { title: t.landing.step2Title, desc: t.landing.step2Desc, num: '2' },
  { title: t.landing.step3Title, desc: t.landing.step3Desc, num: '3' },
]

const BENEFITS = [
  { title: t.landing.benefit1Title, desc: t.landing.benefit1Desc },
  { title: t.landing.benefit2Title, desc: t.landing.benefit2Desc },
  { title: t.landing.benefit3Title, desc: t.landing.benefit3Desc },
]

const LandingPage: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Nav */}
      <header className="flex h-14 items-center justify-between border-b border-border px-4 sm:px-8">
        <span className="text-lg font-bold tracking-tight">Tablio</span>
        <Link
          to="/login"
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:opacity-80"
        >
          {t.landing.loginLink}
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-4 py-16 text-center sm:px-8 sm:py-24">
        <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {t.landing.heroTitle}
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          {t.landing.heroSubtitle}
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to={`/menu/${DEMO_SLUG}`}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            {t.landing.ctaPrimary}
          </Link>
          <a
            href="https://wa.me/573000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            {t.landing.ctaSecondary}
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-muted/30 px-4 py-14 sm:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold">{t.landing.howTitle}</h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} className="flex flex-col gap-3 rounded-xl bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {num}
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-14 sm:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold">{t.landing.benefitsTitle}</h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {BENEFITS.map(({ title, desc }) => (
            <div key={title} className="flex flex-col gap-2 rounded-xl border border-border p-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="border-t border-border bg-primary px-4 py-14 text-center sm:px-8">
        <h2 className="mb-4 text-2xl font-bold text-primary-foreground">{t.landing.heroTitle}</h2>
        <Link
          to={`/menu/${DEMO_SLUG}`}
          className="inline-block rounded-lg border-2 border-primary-foreground px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
        >
          {t.landing.ctaPrimary}
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        {t.landing.footerCopy}
      </footer>
    </div>
  )
}

export default LandingPage

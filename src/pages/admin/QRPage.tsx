import { Download, ExternalLink, Info } from 'lucide-react'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { type FC, useRef } from 'react'

import { useMyRestaurant } from '@/features/restaurants/hooks'
import { t } from '@/locales/es'

// ─── Page ─────────────────────────────────────────────────────────────────────

const QRPage: FC = () => {
  const { data: restaurant } = useMyRestaurant()
  const canvasRef = useRef<HTMLDivElement>(null)

  if (!restaurant) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">{t.qr.noRestaurant}</div>
    )
  }

  const menuUrl = `${window.location.origin}/menu/${restaurant.slug}`

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `tablio-qr-${restaurant.slug}.png`
    a.click()
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">{t.qr.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.qr.pageSubtitle}</p>
      </div>

      {/* QR card */}
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-start">
        {/* SVG for display */}
        <div className="flex flex-shrink-0 flex-col items-center gap-4">
          <div className="rounded-xl border border-border bg-white p-4">
            <QRCodeSVG value={menuUrl} size={200} level="H" marginSize={1} />
          </div>

          {/* Hidden canvas for PNG download */}
          <div ref={canvasRef} className="hidden" aria-hidden="true">
            <QRCodeCanvas value={menuUrl} size={400} level="H" marginSize={2} />
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            {t.qr.downloadPng}
          </button>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.qr.menuUrl}
            </p>
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
              <span className="min-w-0 truncate text-sm text-foreground">{menuUrl}</span>
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.qr.openMenu}
                className="flex-shrink-0 text-primary hover:opacity-70"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-sm text-amber-800">{t.qr.printTip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRPage

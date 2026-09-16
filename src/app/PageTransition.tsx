import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

/** Cinematic preloader with brand + SPA page enter. */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <div key={location.pathname + location.search} className="page-transition">
      <div className="page-preloader" aria-hidden>
        <div className="page-preloader__veil" />
        <div className="page-preloader__mark">
          <span className="page-preloader__brand">{t('brand')}</span>
          <span className="page-preloader__rule" />
        </div>
      </div>
      {children}
    </div>
  )
}

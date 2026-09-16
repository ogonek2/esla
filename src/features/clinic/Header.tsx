import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'
import { Container } from '@/shared/ui/layout'
import { useState } from 'react'

export function Header() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phone, phoneHref } = useClinic()
  const [menuOpen, setMenuOpen] = useState(false)
  const lp = (path: string) => localizedPath(locale, path)

  const nav = [
    { label: t('nav.services'), to: lp(routes.services) },
    { label: t('nav.prices'), to: lp(routes.prices) },
    { label: t('nav.endolift'), to: lp(routes.endolift) },
    { label: t('nav.doctors'), to: lp(routes.doctors) },
    { label: t('nav.blog'), to: lp(routes.blog) },
    { label: t('nav.about'), to: lp(routes.page('about')) },
    { label: t('nav.contacts'), to: lp(routes.contacts) },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e1de]/80">
      <Container className="flex items-center justify-between h-20">
        <Link to={lp(routes.home)} className="flex items-center gap-3">
          <span
            className="text-2xl tracking-[0.28em] font-semibold text-[#111110]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('brand')}
          </span>
          <span className="hidden sm:block w-px h-6 bg-[#e2e1de]" />
          <span className="hidden sm:block text-[12px] tracking-[0.22em] text-[#6b6b68] uppercase font-medium">
            {t('tagline')}
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-9">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[13px] tracking-[0.14em] text-[#6b6b68] hover:text-[#111110] transition-colors duration-200 font-semibold uppercase"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <a
            href={phoneHref}
            className="hidden md:flex items-center gap-2 bg-[#111110] text-white text-[13px] font-semibold px-4 py-2 hover:bg-[#333] transition-colors duration-200 tracking-wide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            {phone}
          </a>
          <button
            className="xl:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            type="button"
          >
            <div
              className={`w-5 h-0.5 bg-[#111110] mb-1.5 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <div
              className={`w-5 h-0.5 bg-[#111110] mb-1.5 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}
            />
            <div
              className={`w-5 h-0.5 bg-[#111110] transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>
      </Container>

      {menuOpen && (
        <div className="xl:hidden bg-white border-t border-[#e2e1de]">
          <Container className="py-6">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[14px] font-medium text-[#111110] border-b border-[#f0efec] uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
            <a
              href={phoneHref}
              className="mt-4 flex items-center gap-2 bg-[#111110] text-white text-[14px] font-semibold px-4 py-3 text-center justify-center"
            >
              {t('sticky.call')}: {phone}
            </a>
          </Container>
        </div>
      )}
    </header>
  )
}

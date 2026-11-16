import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'
import { Container } from '@/shared/ui/layout'
import { useEffect, useState } from 'react'

export function Header() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phone, phoneHref } = useClinic()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('menu-open')
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const menu =
    mounted &&
    createPortal(
      <div
        className={`xl:hidden fixed inset-0 z-[100] ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
        />

        <div
          className={`absolute inset-0 flex flex-col bg-[#111110] text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-16 sm:h-20 shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 sm:px-8">
            <Link
              to={lp(routes.home)}
              onClick={() => setMenuOpen(false)}
              className="min-w-0"
            >
              <span
                className="block text-xl sm:text-2xl tracking-[0.22em] font-semibold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('brand')}
              </span>
              <span className="mt-0.5 block text-[10px] tracking-[0.22em] uppercase text-white/40">
                {t('tagline')}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-white hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
              aria-label="Close menu"
            >
              <span className="relative block h-3.5 w-3.5">
                <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-8 py-6 sm:py-8">
            <ul className="space-y-0">
              {nav.map((item, i) => (
                <li
                  key={item.to}
                  className={`transition-all duration-500 ${
                    menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${80 + i * 40}ms` : '0ms' }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-baseline gap-4 border-b border-white/10 py-4"
                  >
                    <span className="w-7 shrink-0 font-mono text-[11px] tracking-widest text-[#c8a97e]/80">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[1.7rem] sm:text-[2rem] leading-[1.1] text-white group-hover:text-[#c8a97e] transition-colors">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-white/10 px-5 sm:px-8 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <LanguageSwitcher />
              <a
                href={phoneHref}
                className="text-[13px] tracking-wide text-white/60 hover:text-[#c8a97e] transition-colors"
              >
                {phone}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={phoneHref}
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
              >
                <PhoneIcon />
                {t('sticky.call')}
              </a>
              <Link
                to={lp(routes.booking)}
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center bg-[#c8a97e] text-[#111110] px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#d4b896] transition-colors"
              >
                {t('sticky.book')}
              </Link>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e1de]/80">
        <Container className="flex items-center justify-between gap-3 h-16 sm:h-20">
          <Link
            to={lp(routes.home)}
            className="flex items-center gap-3 min-w-0 shrink"
            onClick={() => setMenuOpen(false)}
          >
            <span
              className="text-xl sm:text-2xl tracking-[0.22em] sm:tracking-[0.28em] font-semibold text-[#111110]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('brand')}
            </span>
            <span className="hidden lg:block w-px h-6 bg-[#e2e1de]" />
            <span className="hidden lg:block text-[12px] tracking-[0.22em] text-[#6b6b68] uppercase font-medium">
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

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <a
              href={phoneHref}
              className="hidden md:flex items-center gap-2 bg-[#111110] text-white text-[13px] font-semibold px-4 py-2 hover:bg-[#333] transition-colors duration-200 tracking-wide"
            >
              <PhoneIcon />
              {phone}
            </a>

            <a
              href={phoneHref}
              className="md:hidden inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 border border-[#111110] text-[#111110] text-[11px] font-bold uppercase tracking-wide hover:bg-[#111110] hover:text-white transition-colors"
            >
              <PhoneIcon />
              <span>{t('sticky.call')}</span>
            </a>
            <Link
              to={lp(routes.booking)}
              className="md:hidden inline-flex items-center justify-center h-9 sm:h-10 px-2.5 sm:px-3 bg-[#c8a97e] text-[#111110] text-[11px] font-bold uppercase tracking-wide hover:bg-[#d4b896] transition-colors"
            >
              {t('sticky.book')}
            </Link>

            <button
              className="xl:hidden flex h-10 w-10 items-center justify-center text-[#111110]"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              type="button"
            >
              <span className="sr-only">Menu</span>
              <span className="relative block h-3.5 w-5">
                <span className="absolute left-0 top-0 h-[1.5px] w-full bg-current" />
                <span className="absolute left-0 top-[6px] h-[1.5px] w-full bg-current" />
                <span className="absolute left-0 top-[12px] h-[1.5px] w-full bg-current" />
              </span>
            </button>
          </div>
        </Container>
      </header>
      {menu}
    </>
  )
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  )
}

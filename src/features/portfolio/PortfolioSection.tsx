import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { PortfolioCase } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import type { Locale } from '@/shared/config/locales'
import { localizedPath, routes } from '@/shared/config/routes'
import { Container, Section, SectionHeader } from '@/shared/ui/layout'
import { Reveal } from '@/shared/ui/motion'
import { getCategoryVisual } from '@/features/services/categoryVisuals'

/** Cover for a case — real photo or atmospheric fallback by service slug. */
export function portfolioCover(item: PortfolioCase): string {
  if (item.after_url) return item.after_url
  if (item.before_url) return item.before_url
  const slug = item.service?.slug || ''
  if (slug.includes('endolift')) return getCategoryVisual('endolift').image
  if (slug.includes('rhino') || slug.includes('septoplasty') || slug.includes('oto'))
    return getCategoryVisual('otolaryngology').image
  if (slug.includes('blepharo') || slug.includes('facelift') || slug.includes('neck'))
    return getCategoryVisual('face-neck-plastics').image
  if (slug.includes('lipo') || slug.includes('body') || slug.includes('abdomino'))
    return getCategoryVisual('body-care').image
  return getCategoryVisual().image
}

function CaseFrame({
  item,
  locale,
  beforeAfter,
  inert,
}: {
  item: PortfolioCase
  locale: Locale
  beforeAfter: string
  inert?: boolean
}) {
  const img = portfolioCover(item)
  return (
    <Link
      to={localizedPath(locale, routes.portfolioCase(item.slug))}
      className="portfolio-strip__item group relative shrink-0 overflow-hidden bg-[#161412]"
      tabIndex={inert ? -1 : undefined}
      aria-hidden={inert || undefined}
    >
      <img
        src={img}
        alt={inert ? '' : item.title}
        className="portfolio-strip__img"
        draggable={false}
      />
      <div className="portfolio-strip__veil" />
      <div className="portfolio-strip__meta">
        <p className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[#c8a97e] font-semibold mb-2">
          {beforeAfter}
        </p>
        <p className="text-white font-display text-lg sm:text-xl leading-tight">{item.title}</p>
        {item.service?.name && (
          <p className="mt-2 text-[12px] text-white/45">{item.service.name}</p>
        )}
      </div>
    </Link>
  )
}

export function PortfolioSection({ cases }: { cases: PortfolioCase[] }) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const stripRef = useRef<HTMLDivElement>(null)
  const nudgeTimer = useRef<number | null>(null)

  const visible = useMemo(() => cases, [cases])

  // Exactly 3 identical sequences → CSS translates by -33.333% for a seamless loop
  const sequences = useMemo(() => [0, 1, 2] as const, [])

  const durationSec = Math.max(32, visible.length * 8)

  if (!visible.length) return null

  const nudge = (dir: -1 | 1) => {
    const el = stripRef.current
    if (!el) return
    if (nudgeTimer.current) window.clearTimeout(nudgeTimer.current)
    el.classList.remove('portfolio-strip--nudge-prev', 'portfolio-strip--nudge-next')
    void el.offsetWidth
    el.classList.add(dir < 0 ? 'portfolio-strip--nudge-prev' : 'portfolio-strip--nudge-next')
    nudgeTimer.current = window.setTimeout(() => {
      el.classList.remove('portfolio-strip--nudge-prev', 'portfolio-strip--nudge-next')
    }, 1800)
  }

  return (
    <Section id="portfolio" tone="dark" className="bg-[#0e0e0d]">
      <Container>
        <SectionHeader
          dark
          eyebrow={t('portfolio.eyebrow')}
          title={t('portfolio.title')}
          action={
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={t('common.prev')}
                onClick={() => nudge(-1)}
                className="h-11 w-11 border border-white/20 text-white hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
              >
                ←
              </button>
              <button
                type="button"
                aria-label={t('common.next')}
                onClick={() => nudge(1)}
                className="h-11 w-11 border border-white/20 text-white hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
              >
                →
              </button>
              <Link
                to={localizedPath(locale, routes.portfolio)}
                className="ml-2 hidden sm:inline text-[12px] font-bold uppercase tracking-wide border-b border-white/35 text-white/75 hover:text-[#c8a97e] hover:border-[#c8a97e] transition-colors"
              >
                {t('common.view_all')}
              </Link>
            </div>
          }
        />
      </Container>

      <Reveal>
        <div
          ref={stripRef}
          className="portfolio-strip"
          style={{ ['--portfolio-duration' as string]: `${durationSec}s` }}
        >
          <div className="portfolio-strip__track">
            <div className="portfolio-strip__row">
              {sequences.map((copy) =>
                visible.map((item) => (
                  <CaseFrame
                    key={`${item.id}-${copy}`}
                    item={item}
                    locale={locale}
                    beforeAfter={t('portfolio.before_after')}
                    inert={copy !== 0}
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </Reveal>

      <Container>
        <p className="mt-10 text-center text-[12px] text-white/35 tracking-wide">
          {t('portfolio.consent')}
        </p>
      </Container>
    </Section>
  )
}

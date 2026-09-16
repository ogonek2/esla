import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ServiceCategory } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { formatPriceFrom } from '@/shared/lib/utils'
import { Container, Section, SectionHeader } from '@/shared/ui/layout'
import { ShowcaseSlider } from '@/shared/ui/ShowcaseSlider'
import { Reveal } from '@/shared/ui/motion'
import { getCategoryVisual } from '@/features/services/categoryVisuals'

export function ServicesSection({
  categories,
  minPrices,
}: {
  categories: ServiceCategory[]
  minPrices: Record<string, number | null>
}) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  if (!categories.length) {
    return (
      <Section id="services" className="bg-[#f7f4ef]">
        <Container>
          <p className="text-center text-[#6b6b68]">{t('services.empty')}</p>
        </Container>
      </Section>
    )
  }

  return (
    <Section id="services" tone="dark" className="bg-[#111110]">
      <Container>
        <SectionHeader
          dark
          eyebrow={t('services.eyebrow')}
          title={t('services.title')}
          subtitle={t('services.subtitle')}
          action={
            <Link
              to={localizedPath(locale, routes.services)}
              className="hidden sm:inline text-[12px] font-bold uppercase tracking-wide border-b border-white/40 text-white/80 hover:text-[#c8a97e] hover:border-[#c8a97e] transition-colors"
            >
              {t('common.view_all')}
            </Link>
          }
        />

        <Reveal>
          <ShowcaseSlider
            dark
            step={640}
            labelPrev={t('common.prev')}
            labelNext={t('common.next')}
            trackClassName="-mx-5 sm:-mx-8 md:-mx-12 lg:mx-0 px-5 sm:px-8 md:px-12 lg:px-0"
          >
            {categories.map((c, i) => {
              const visual = getCategoryVisual(c.slug)
              const featured = c.slug === 'endolift'
              const price = formatPriceFrom(minPrices[c.slug], locale)

              return (
                <Link
                  key={c.id}
                  to={localizedPath(locale, `${routes.services}?category=${c.slug}`)}
                  className={`group relative shrink-0 snap-center overflow-hidden ${
                    featured
                      ? 'w-[min(88vw,720px)] aspect-[4/5] sm:aspect-[16/10]'
                      : 'w-[min(78vw,520px)] aspect-[4/5] sm:aspect-[3/4]'
                  }`}
                >
                  <img
                    src={visual.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-[1.1s] ease-out group-hover:scale-100"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(160deg, ${visual.tint}ee 8%, transparent 55%), linear-gradient(to top, #111110f2 12%, transparent 58%)`,
                    }}
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#c8a97e]/10 mix-blend-soft-light" />

                  <div className="relative z-10 flex h-full flex-col justify-between p-7 sm:p-9 lg:p-10">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[12px] font-mono tracking-[0.28em] text-[#c8a97e]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] tracking-[0.22em] uppercase text-white/45 group-hover:text-[#c8a97e] transition-colors">
                        {price || t('services.price_on_request')}
                      </span>
                    </div>

                    <div>
                      <h3
                        className={`font-display text-white leading-[1.05] mb-4 transition-colors group-hover:text-[#c8a97e] ${
                          featured
                            ? 'text-3xl sm:text-4xl lg:text-5xl'
                            : 'text-2xl sm:text-3xl lg:text-4xl'
                        }`}
                      >
                        {c.name}
                      </h3>
                      {c.description && (
                        <p className="text-[14px] sm:text-[15px] text-white/55 leading-relaxed max-w-md line-clamp-3">
                          {c.description}
                        </p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-white/70 group-hover:text-[#c8a97e] transition-colors">
                        {t('common.view_all')}
                        <span className="translate-x-0 group-hover:translate-x-1.5 transition-transform">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </ShowcaseSlider>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to={localizedPath(locale, routes.prices)}
              className="inline-flex border border-white/30 text-white px-9 py-4 text-[13px] font-bold uppercase tracking-wide hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
            >
              {t('nav.prices')}
            </Link>
            <Link
              to={localizedPath(locale, routes.booking)}
              className="inline-flex bg-[#c8a97e] text-[#111110] px-9 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#d4b896] transition-colors"
            >
              {t('services.cta')}
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

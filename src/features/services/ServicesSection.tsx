import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Direction } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Container, Section, SectionHeader } from '@/shared/ui/layout'
import { ShowcaseSlider } from '@/shared/ui/ShowcaseSlider'
import { Reveal } from '@/shared/ui/motion'

const FALLBACK_PHOTOS = ['/2.jpg', '/3.jpg', '/4.jpg']

export function ServicesSection({ directions }: { directions: Direction[] }) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const pricesPath = localizedPath(locale, routes.prices)
  const list = directions || []

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

        {list.length === 0 ? (
          <p className="text-white/55">{t('services.empty')}</p>
        ) : (
        <Reveal>
          <ShowcaseSlider
            dark
            step={640}
            labelPrev={t('common.prev')}
            labelNext={t('common.next')}
            trackClassName="-mx-5 sm:-mx-8 md:-mx-12 lg:mx-0 px-5 sm:px-8 md:px-12 lg:px-0"
          >
            {list.map((direction, i) => (
              <Link
                key={direction.id}
                to={
                  direction.category_slug
                    ? localizedPath(locale, `${routes.prices}?category=${direction.category_slug}`)
                    : pricesPath
                }
                className="group relative shrink-0 snap-center overflow-hidden w-[min(78vw,520px)] aspect-[4/5] sm:aspect-[3/4]"
              >
                <img
                  src={direction.image_url || FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-[1.1s] ease-out group-hover:scale-100"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(160deg, #161412ee 8%, transparent 55%), linear-gradient(to top, #111110f2 12%, transparent 58%)',
                  }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#c8a97e]/10 mix-blend-soft-light" />

                <div className="relative z-10 flex h-full flex-col justify-between p-7 sm:p-9 lg:p-10">
                  <span className="text-[12px] font-mono tracking-[0.28em] text-[#c8a97e]">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <h3 className="font-display text-white text-2xl sm:text-3xl lg:text-4xl leading-[1.05] mb-4 transition-colors group-hover:text-[#c8a97e]">
                      {direction.name}
                    </h3>
                    <span className="mt-6 inline-flex items-center gap-3 text-[12px] tracking-[0.2em] uppercase text-white/70 group-hover:text-[#c8a97e] transition-colors">
                      {t('nav.prices')}
                      <span className="translate-x-0 group-hover:translate-x-1.5 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </ShowcaseSlider>
        </Reveal>
        )}

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

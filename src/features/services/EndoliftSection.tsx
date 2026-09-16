import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Service } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { formatPriceFrom } from '@/shared/lib/utils'
import { Container, Section } from '@/shared/ui/layout'
import { Parallax, Reveal } from '@/shared/ui/motion'
import { ServiceArt } from '@/features/services/ServiceArt'

export function EndoliftSection({ featured }: { featured: Service[] }) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const zones = featured.filter((s) => s.name).slice(0, 5)

  return (
    <Section tone="dark" id="endolift" className="overflow-x-clip">
      <Parallax
        speed={0.35}
        className="pointer-events-none absolute -left-[10%] top-1/4 w-[min(50vw,40rem)] opacity-20 hidden lg:block"
      >
        <ServiceArt variant={3} tone="gold" />
      </Parallax>

      <Container className="overflow-x-clip">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <Reveal className="lg:col-span-6 min-w-0" direction="up">
            <p className="text-[12px] md:text-[13px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-6">
              {t('endolift.eyebrow')}
            </p>
            <h2 className="text-display font-normal mb-7 font-display">{t('endolift.title')}</h2>
            <p className="text-lead text-white/60 mb-10 max-w-xl">{t('endolift.subtitle')}</p>
            {zones.length > 0 && (
              <ul className="space-y-4 mb-12 border-l border-white/15 pl-6">
                {zones.map((zone, i) => (
                  <Reveal key={zone.id} delay={i * 70} as="li">
                    <div className="flex items-center justify-between gap-4 text-[15px] md:text-[16px] text-white/70">
                      <Link
                        to={localizedPath(locale, routes.service(zone.slug))}
                        className="hover:text-[#c8a97e] transition-colors min-w-0"
                      >
                        {zone.name}
                      </Link>
                      <span className="text-[11px] uppercase tracking-wide text-white/35 shrink-0">
                        {formatPriceFrom(zone.price_from, locale, zone.price_label) ||
                          t('services.price_on_request')}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-4">
              <Link
                to={localizedPath(locale, routes.endolift)}
                className="inline-flex items-center gap-2 border border-[#c8a97e] text-[#c8a97e] px-8 py-4 text-[14px] font-bold tracking-wide uppercase hover:bg-[#c8a97e] hover:text-[#111110] transition-all duration-300"
              >
                {t('endolift.learn_more')}
              </Link>
              <Link
                to={localizedPath(locale, routes.booking)}
                className="inline-flex items-center gap-2 text-[14px] font-bold tracking-wide uppercase text-white/70 hover:text-white border-b border-white/30 pb-0.5"
              >
                {t('endolift.cta')}
              </Link>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6 min-w-0" direction="up" delay={120}>
            <div className="relative lg:ml-auto lg:max-w-xl xl:max-w-2xl overflow-hidden">
              <Parallax speed={-0.22} className="relative overflow-hidden">
                <div
                  className="aspect-[3/4] bg-cover bg-center ken-burns"
                  style={{
                    backgroundImage:
                      'url(https://images.unsplash.com/photo-1785861378703-1c991c4548ef?w=1200&h=1600&fit=crop&auto=format)',
                  }}
                />
              </Parallax>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
              <Parallax
                speed={0.5}
                className="absolute -bottom-10 -left-10 w-40 opacity-70 hidden lg:block float-slow"
              >
                <ServiceArt variant={2} tone="gold" />
              </Parallax>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

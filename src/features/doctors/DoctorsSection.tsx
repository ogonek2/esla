import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Doctor } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Container, Section, SectionHeader } from '@/shared/ui/layout'
import { ShowcaseSlider } from '@/shared/ui/ShowcaseSlider'
import { ServiceArt } from '@/features/services/ServiceArt'
import { Reveal } from '@/shared/ui/motion'

export function DoctorsSection({ doctors }: { doctors: Doctor[] }) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const list = doctors.slice(0, 8)

  if (!list.length) return null

  return (
    <Section id="doctors" className="bg-[#f7f4ef]">
      <Container>
        <SectionHeader
          eyebrow={t('doctors.eyebrow')}
          title={t('doctors.title')}
          action={
            <Link
              to={localizedPath(locale, routes.doctors)}
              className="hidden sm:inline text-[12px] font-bold uppercase tracking-wide border-b border-[#111110]"
            >
              {t('common.view_all')}
            </Link>
          }
        />

        <Reveal>
          <ShowcaseSlider
            step={480}
            labelPrev={t('common.prev')}
            labelNext={t('common.next')}
            trackClassName="-mx-5 sm:-mx-8 md:-mx-12 lg:mx-0 px-5 sm:px-8 md:px-12 lg:px-0"
          >
            {list.map((d, i) => (
              <article
                key={d.id}
                className="group relative shrink-0 snap-center w-[min(82vw,420px)] lg:w-[min(38vw,460px)]"
              >
                <Link
                  to={localizedPath(locale, routes.doctor(d.slug))}
                  className="relative block overflow-hidden bg-[#161412] aspect-[3/4]"
                >
                  {d.photo_url ? (
                    <img
                      src={d.photo_url}
                      alt={d.name}
                      className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.04] grayscale-[0.35] group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="absolute inset-0 p-10 flex items-end">
                      <ServiceArt
                        variant={(i % 4) as 0 | 1 | 2 | 3}
                        tone="gold"
                        className="absolute inset-0 p-10 opacity-70"
                      />
                      <span className="relative text-[11px] tracking-[0.25em] uppercase text-[#c8a97e]">
                        {t('brand')}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#111110] via-[#111110]/25 to-transparent opacity-90" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-1 ring-inset ring-[#c8a97e]/35" />

                  <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                    {d.experience_years != null && (
                      <p className="text-[11px] tracking-[0.28em] uppercase text-[#c8a97e] mb-3 font-semibold">
                        {d.experience_years} {t('doctors.years')}
                      </p>
                    )}
                    <h3 className="text-2xl sm:text-3xl font-display text-white leading-tight mb-2">
                      {d.name}
                    </h3>
                    {d.position && (
                      <p className="text-[14px] text-white/55 mb-5 max-w-sm">{d.position}</p>
                    )}
                    <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-white/70 group-hover:text-[#c8a97e] transition-colors">
                      {t('doctors.book')}
                      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        →
                      </span>
                    </span>
                  </div>
                </Link>

                <div className="mt-4 flex justify-end">
                  <Link
                    to={localizedPath(locale, `${routes.booking}?doctor=${d.slug}`)}
                    className="text-[12px] font-bold tracking-wide uppercase border-b border-[#111110] pb-0.5 hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
                  >
                    {t('doctors.book')}
                  </Link>
                </div>
              </article>
            ))}
          </ShowcaseSlider>
        </Reveal>
      </Container>
    </Section>
  )
}

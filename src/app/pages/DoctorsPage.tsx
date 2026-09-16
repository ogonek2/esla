import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type { Doctor } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Seo } from '@/features/seo/Seo'
import { Container } from '@/shared/ui/layout'
import { DoctorGridSkeleton } from '@/shared/ui/Skeleton'
import { DarkCtaBand, PageHero, WarmPage } from '@/shared/ui/PageHero'
import { ServiceArt } from '@/features/services/ServiceArt'

export function DoctorsPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.doctors(locale)
        if (!cancelled) setDoctors(res.data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [locale])

  return (
    <WarmPage>
      <Seo title={t('doctors.title')} description={t('doctors.page_subtitle')} />
      <PageHero
        eyebrow={t('doctors.eyebrow')}
        title={t('doctors.title')}
        subtitle={t('doctors.page_subtitle')}
        art={1}
        image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1400&h=900&fit=crop&auto=format"
        actions={
          <Link
            to={localizedPath(locale, routes.booking)}
            className="inline-flex bg-[#c8a97e] text-[#111110] px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide hover:bg-[#b8966b] transition-colors"
          >
            {t('doctors.book')}
          </Link>
        }
      />

      <section className="py-14 lg:py-20">
        <Container>
          {loading ? (
            <DoctorGridSkeleton />
          ) : doctors.length === 0 ? (
            <p className="text-center text-[#6b6b68] py-16">{t('doctors.empty')}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {doctors.map((d, i) => (
                <Link
                  key={d.id}
                  to={localizedPath(locale, routes.doctor(d.slug))}
                  className="group bg-white border border-[#e8e2d8] overflow-hidden hover:border-[#c8a97e]/60 hover:shadow-[0_20px_40px_-28px_rgba(17,17,16,0.4)] transition-all duration-300"
                >
                  <div className="relative overflow-hidden bg-[#161412]">
                    {d.photo_url ? (
                      <img
                        src={d.photo_url}
                        alt={d.name}
                        className="w-full aspect-[3/4] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] relative flex items-end p-6">
                        <div className="absolute inset-0 opacity-70 p-8">
                          <ServiceArt variant={(i % 4) as 0 | 1 | 2 | 3} tone="gold" />
                        </div>
                        <span className="relative text-[11px] tracking-[0.3em] uppercase text-[#c8a97e]">
                          {t('brand')}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111110]/70 to-transparent" />
                  </div>
                  <div className="p-6">
                    {d.experience_years != null && (
                      <p className="text-[11px] tracking-[0.22em] uppercase text-[#c8a97e] font-semibold mb-2">
                        {d.experience_years} {t('doctors.years')}
                      </p>
                    )}
                    <h2 className="text-xl font-display mb-1">{d.name}</h2>
                    {d.position && (
                      <p className="text-sm text-[#6b6b68] leading-relaxed mb-4">{d.position}</p>
                    )}
                    <span className="inline-flex text-[12px] font-bold uppercase tracking-wide border-b border-[#111110] group-hover:border-[#c8a97e] group-hover:text-[#c8a97e] transition-colors pb-0.5">
                      {t('common.view_all')} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <DarkCtaBand
            eyebrow={t('booking.eyebrow')}
            title={t('doctors.cta_title')}
            text={t('doctors.cta_text')}
            action={
              <Link
                to={localizedPath(locale, routes.booking)}
                className="inline-flex bg-[#c8a97e] text-[#111110] px-8 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#b8966b] transition-colors"
              >
                {t('doctors.book')}
              </Link>
            }
          />
        </Container>
      </section>
    </WarmPage>
  )
}

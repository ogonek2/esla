import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type { Doctor } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Seo } from '@/features/seo/Seo'
import { LeadForm } from '@/features/booking/LeadForm'
import { Container } from '@/shared/ui/layout'
import { Skeleton, SkeletonText } from '@/shared/ui/Skeleton'
import { WarmPage } from '@/shared/ui/PageHero'
import { AmbientGlow, GoldRule, ServiceArt } from '@/features/services/ServiceArt'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { formatPriceFrom } from '@/shared/lib/utils'

export function DoctorDetailPage() {
  const { slug = '' } = useParams()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phone, phoneHref } = useClinic()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.doctor(slug, locale)
        if (!cancelled) setDoctor(data)
      } catch {
        if (!cancelled) setDoctor(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, locale])

  if (loading) {
    return (
      <WarmPage>
        <div className="bg-[#111110] -mt-20 pt-20 py-24">
          <Container>
            <Skeleton className="h-10 w-1/2 bg-white/10 mb-4" />
            <Skeleton className="h-4 w-1/3 bg-white/10" />
          </Container>
        </div>
        <Container className="py-16">
          <SkeletonText lines={8} />
        </Container>
      </WarmPage>
    )
  }

  if (!doctor) {
    return (
      <WarmPage>
        <p className="py-32 text-center text-[#6b6b68]">404</p>
      </WarmPage>
    )
  }

  return (
    <WarmPage>
      <Seo
        title={doctor.seo?.title || doctor.name}
        description={doctor.seo?.description || doctor.bio || undefined}
      />

      <section className="relative overflow-hidden bg-[#111110] text-white -mt-20 pt-20">
        <AmbientGlow />
        <Container className="relative z-10 py-14 lg:py-20">
          <Link
            to={localizedPath(locale, routes.doctors)}
            className="inline-flex text-[12px] uppercase tracking-[0.18em] text-white/55 hover:text-[#c8a97e] transition-colors mb-8"
          >
            ← {t('nav.doctors')}
          </Link>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-end">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <p className="text-[11px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-4">
                {t('doctors.eyebrow')}
              </p>
              <GoldRule className="mb-5" />
              <h1 className="text-4xl sm:text-5xl font-display leading-[1.08] mb-4">{doctor.name}</h1>
              {doctor.position && (
                <p className="text-white/70 text-lg mb-4 max-w-xl">{doctor.position}</p>
              )}
              {doctor.experience_years != null && (
                <p className="text-[12px] uppercase tracking-[0.22em] text-[#c8a97e] mb-8">
                  {doctor.experience_years} {t('doctors.years')}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <a
                  href="#doctor-booking"
                  className="inline-flex bg-[#c8a97e] text-[#111110] px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide hover:bg-[#b8966b] transition-colors"
                >
                  {t('doctors.book')}
                </a>
                <a
                  href={phoneHref}
                  className="inline-flex border border-white/25 px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative aspect-[3/4] max-w-md ml-auto overflow-hidden bg-[#1a1816] border border-white/10">
                {doctor.photo_url ? (
                  <img
                    src={doctor.photo_url}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 p-10 flex items-center justify-center">
                    <ServiceArt variant={1} tone="gold" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14">
            <div className="lg:col-span-7 xl:col-span-8 space-y-12">
              {doctor.bio && (
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-4">
                    {t('doctors.bio_eyebrow')}
                  </p>
                  <h2 className="text-3xl font-display mb-6">{t('doctors.bio_title')}</h2>
                  <p className="whitespace-pre-wrap text-[#3a3834] text-[16px] leading-[1.75] max-w-2xl">
                    {doctor.bio}
                  </p>
                </div>
              )}

              {doctor.services && doctor.services.length > 0 && (
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-4">
                    {t('nav.services')}
                  </p>
                  <h2 className="text-3xl font-display mb-8">{t('doctors.services_title')}</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {doctor.services.map((s) => (
                      <Link
                        key={s.id}
                        to={localizedPath(locale, routes.service(s.slug))}
                        className="group bg-white border border-[#e8e2d8] p-5 hover:border-[#c8a97e]/60 transition-colors"
                      >
                        <h3 className="font-semibold mb-2 group-hover:text-[#c8a97e] transition-colors">
                          {s.name}
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#9a958c]">
                          {formatPriceFrom(s.price_from, locale, s.price_label) ||
                            t('services.price_on_request')}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-5 xl:col-span-4">
              <div
                id="doctor-booking"
                className="lg:sticky lg:top-24 bg-[#111110] text-white p-7 lg:p-8 border border-white/10"
              >
                <AmbientGlow className="opacity-50" />
                <div className="relative z-10">
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-3">
                    {t('booking.eyebrow')}
                  </p>
                  <h2 className="font-display text-2xl mb-2">{t('doctors.book')}</h2>
                  <p className="text-white/55 text-sm mb-6">{t('service.book_text')}</p>
                  <LeadForm type="booking" compact variant="dark" />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </WarmPage>
  )
}

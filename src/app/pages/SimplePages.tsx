import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type { FaqItem, Review } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Seo } from '@/features/seo/Seo'
import { LeadForm } from '@/features/booking/LeadForm'
import { CrmBookingWidget } from '@/features/booking/CrmBookingWidget'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { SocialLinks } from '@/features/clinic/SocialLinks'
import { Container } from '@/shared/ui/layout'
import { Skeleton, SkeletonText } from '@/shared/ui/Skeleton'
import { DarkCtaBand, PageHero, WarmPage } from '@/shared/ui/PageHero'
import { GoldRule } from '@/features/services/ServiceArt'

export function ReviewsPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await api.reviews(locale)
        if (!cancelled) setReviews(r.data)
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
      <Seo title={t('reviews.title')} description={t('reviews.page_subtitle')} />
      <PageHero
        eyebrow={t('reviews.eyebrow')}
        title={t('reviews.title')}
        subtitle={t('reviews.page_subtitle')}
        art={0}
        image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1400&h=900&fit=crop&auto=format"
      />

      <section className="py-14 lg:py-20">
        <Container>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-[#e8e2d8] p-8 space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <SkeletonText lines={4} />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-[#6b6b68] py-16">{t('reviews.empty')}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="bg-[#111110] text-white p-8 lg:p-9 flex flex-col border border-white/5"
                >
                  {r.rating != null && (
                    <div className="flex gap-1 mb-6 text-[#c8a97e]">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  )}
                  {r.text && (
                    <p className="text-white/80 text-[15px] leading-relaxed mb-8 font-display italic flex-1">
                      &ldquo;{r.text}&rdquo;
                    </p>
                  )}
                  <div className="border-t border-white/10 pt-5 mt-auto">
                    <p className="font-semibold text-[14px]">{r.author_name}</p>
                    {r.source && <p className="text-[12px] text-white/40 mt-0.5">{r.source}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <DarkCtaBand
            eyebrow={t('booking.eyebrow')}
            title={t('cta.title')}
            text={t('cta.subtitle')}
            action={
              <Link
                to={localizedPath(locale, routes.booking)}
                className="inline-flex bg-[#c8a97e] text-[#111110] px-8 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#b8966b] transition-colors"
              >
                {t('services.cta')}
              </Link>
            }
          />
        </Container>
      </section>
    </WarmPage>
  )
}

export function FaqPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phoneHref } = useClinic()
  const [items, setItems] = useState<FaqItem[]>([])
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.faq(locale)
        if (!cancelled) setItems(data)
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
      <Seo title={t('faq.title')} description={t('faq.subtitle')} />
      <PageHero
        eyebrow={t('faq.eyebrow')}
        title={t('faq.title')}
        subtitle={t('faq.subtitle')}
        art={3}
        image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&h=900&fit=crop&auto=format"
        actions={
          <a
            href={phoneHref}
            className="inline-flex bg-[#c8a97e] text-[#111110] px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide hover:bg-[#b8966b] transition-colors"
          >
            {t('faq.call')}
          </a>
        }
      />

      <section className="py-14 lg:py-20">
        <Container>
          {loading ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-[#6b6b68] py-16">{t('faq.empty')}</p>
          ) : (
            <div className="max-w-3xl mx-auto bg-white border border-[#e8e2d8] divide-y divide-[#e8e2d8]">
              {items.map((faq, i) => (
                <div key={faq.id} className="px-6">
                  <button
                    type="button"
                    className="w-full flex items-start justify-between gap-4 text-left py-5"
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    aria-expanded={openIdx === i}
                  >
                    <span className="font-semibold text-[15px] leading-snug">{faq.question}</span>
                    <span
                      className={`shrink-0 w-7 h-7 border border-[#e8e2d8] flex items-center justify-center transition-all ${openIdx === i ? 'rotate-45 bg-[#111110] text-white border-[#111110]' : ''}`}
                    >
                      +
                    </span>
                  </button>
                  {openIdx === i && faq.answer && (
                    <p className="pb-5 text-sm text-[#6b6b68] leading-relaxed pr-10">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <DarkCtaBand
            eyebrow={t('booking.eyebrow')}
            title={t('faq.cta_title')}
            text={t('faq.cta_text')}
            action={
              <Link
                to={localizedPath(locale, routes.booking)}
                className="inline-flex bg-[#c8a97e] text-[#111110] px-8 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#b8966b] transition-colors"
              >
                {t('services.cta')}
              </Link>
            }
          />
        </Container>
      </section>
    </WarmPage>
  )
}

export function ContactsPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { clinic, phone, phoneHref } = useClinic()
  const phones = (clinic?.phones || []).map((p) => String(p || '').trim()).filter(Boolean)
  const displayPhones = phones.length ? phones : phone ? [phone] : []

  return (
    <WarmPage>
      <Seo title={t('contacts.title')} />
      <PageHero
        eyebrow={t('contacts.eyebrow')}
        title={t('contacts.title')}
        subtitle={t('contacts.page_subtitle')}
        art={2}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=900&fit=crop&auto=format"
        actions={
          phoneHref ? (
            <a
              href={phoneHref}
              className="inline-flex bg-[#c8a97e] text-[#111110] px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide hover:bg-[#b8966b] transition-colors"
            >
              {phone || t('sticky.call')}
            </a>
          ) : undefined
        }
      />

      <section className="py-14 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-4 space-y-4">
              {[
                ...displayPhones.map((p) => ({
                  label: t('contacts.phone'),
                  value: p,
                  href: `tel:${p.replace(/[^\d+]/g, '')}`,
                })),
                clinic?.email
                  ? {
                      label: t('contacts.email'),
                      value: clinic.email,
                      href: `mailto:${clinic.email}`,
                    }
                  : null,
                clinic?.address
                  ? { label: t('contacts.address'), value: clinic.address }
                  : null,
                clinic?.schedule
                  ? { label: t('contacts.schedule'), value: clinic.schedule }
                  : null,
              ]
                .filter(Boolean)
                .map((item, idx) => (
                  <div
                    key={`${item!.label}-${item!.value}-${idx}`}
                    className="bg-white border border-[#e8e2d8] p-6"
                  >
                    <p className="text-[11px] tracking-[0.22em] uppercase text-[#c8a97e] font-semibold mb-2">
                      {item!.label}
                    </p>
                    {item!.href ? (
                      <a
                        href={item!.href}
                        className="text-lg font-semibold hover:text-[#c8a97e] transition-colors"
                      >
                        {item!.value}
                      </a>
                    ) : (
                      <p className="text-lg font-semibold">{item!.value}</p>
                    )}
                  </div>
                ))}

              <SocialLinks tone="light" includeMessengers className="pt-2" />
            </div>

            <div className="lg:col-span-8 bg-[#161412] min-h-[22rem] flex items-center justify-center overflow-hidden border border-[#e8e2d8]">
              {clinic?.map?.embed_url ? (
                <iframe
                  title="map"
                  src={clinic.map.embed_url}
                  className="w-full h-full min-h-[22rem] border-0"
                  loading="lazy"
                />
              ) : (
                <p className="text-white/40 text-[13px] text-center px-6">
                  {t('contacts.map_placeholder')}
                </p>
              )}
            </div>
          </div>

          <div className="mt-10">
            <Link
              to={localizedPath(locale, routes.booking)}
              className="inline-flex bg-[#111110] text-white px-8 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#333] transition-colors"
            >
              {t('services.cta')}
            </Link>
          </div>
        </Container>
      </section>
    </WarmPage>
  )
}

export function BookingPage() {
  const { t } = useTranslation()
  const { phone, phoneHref, clinic } = useClinic()

  return (
    <WarmPage>
      <Seo title={t('booking.title')} description={t('booking.subtitle')} />
      <PageHero
        eyebrow={t('booking.eyebrow')}
        title={t('booking.title')}
        subtitle={t('booking.subtitle')}
        art={0}
        image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&h=900&fit=crop&auto=format"
      />

      <section className="py-8 sm:py-12 lg:py-16 pb-28 sm:pb-16">
        <Container>
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            <div className="lg:col-span-8 min-w-0 order-1">
              <CrmBookingWidget />
            </div>

            <aside className="lg:col-span-4 order-2 lg:sticky lg:top-24">
              <div className="bg-white border border-[#e8e2d8] p-5 sm:p-7">
                <GoldRule className="mb-4 sm:mb-5" />
                <p className="text-[11px] tracking-[0.22em] uppercase text-[#c8a97e] font-semibold mb-2">
                  {t('booking.phone_label')}
                </p>
                <a
                  href={phoneHref}
                  className="text-xl sm:text-2xl font-display hover:text-[#c8a97e] transition-colors break-all"
                >
                  {phone}
                </a>
                {clinic?.email && (
                  <div className="mt-5 pt-5 border-t border-[#e8e2d8]">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-[#c8a97e] font-semibold mb-2">
                      {t('contacts.email')}
                    </p>
                    <a
                      href={`mailto:${clinic.email}`}
                      className="font-semibold text-[15px] leading-snug hover:text-[#c8a97e] transition-colors break-all"
                    >
                      {clinic.email}
                    </a>
                  </div>
                )}
                {clinic?.address && (
                  <div className="mt-5 pt-5 border-t border-[#e8e2d8]">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-[#c8a97e] font-semibold mb-2">
                      {t('booking.address_label')}
                    </p>
                    <p className="font-semibold text-[15px] leading-snug">{clinic.address}</p>
                  </div>
                )}
                {clinic?.schedule && (
                  <div className="mt-5 pt-5 border-t border-[#e8e2d8]">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-[#c8a97e] font-semibold mb-2">
                      {t('contacts.schedule')}
                    </p>
                    <p className="font-semibold text-[15px] leading-snug">{clinic.schedule}</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </WarmPage>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type { FaqItem, Service } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { formatPriceFrom } from '@/shared/lib/utils'
import { Seo } from '@/features/seo/Seo'
import { LeadForm } from '@/features/booking/LeadForm'
import { Container } from '@/shared/ui/layout'
import { Skeleton, SkeletonText } from '@/shared/ui/Skeleton'
import { GoldRule } from '@/features/services/ServiceArt'
import { getCategoryVisual } from '@/features/services/categoryVisuals'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { Parallax, Reveal } from '@/shared/ui/motion'
import { portfolioCover } from '@/features/portfolio/PortfolioSection'
import { RichHtml } from '@/shared/ui/RichHtml'

export function ServiceDetailPage() {
  const { slug = '' } = useParams()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phone, phoneHref } = useClinic()
  const [service, setService] = useState<Service | null>(null)
  const [faq, setFaq] = useState<FaqItem[]>([])
  const [related, setRelated] = useState<Service[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const res = await api.service(slug, locale)
        if (cancelled) return
        setService(res.data)
        setFaq(res.faq || [])

        const cat = res.data.category?.slug
        if (cat) {
          const list = await api.services(locale, { category: cat, per_page: 8 })
          if (!cancelled) {
            setRelated(list.data.filter((s) => s.slug !== res.data.slug).slice(0, 4))
          }
        } else {
          setRelated([])
        }
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, locale])

  const visual = getCategoryVisual(service?.category?.slug)
  const heroImage = service?.cover_url || visual.image

  const defaultSteps = [
    { n: '01', title: t('service.steps.1.title'), text: t('service.steps.1.text') },
    { n: '02', title: t('service.steps.2.title'), text: t('service.steps.2.text') },
    { n: '03', title: t('service.steps.3.title'), text: t('service.steps.3.text') },
    { n: '04', title: t('service.steps.4.title'), text: t('service.steps.4.text') },
  ]

  const customSteps = (service?.journey_steps || [])
    .filter((s) => s.title || s.text)
    .map((s, i) => ({
      n: String(i + 1).padStart(2, '0'),
      title: s.title || '',
      text: s.text || '',
    }))

  const steps = customSteps.length > 0 ? customSteps : defaultSteps

  const defaultTrust = (['a', 'b', 'c'] as const).map((key) => ({
    label: t(`service.trust.${key}.label`),
    text: t(`service.trust.${key}.text`),
  }))

  const customTrust = (service?.trust_items || []).filter((item) => item.label || item.text)
  const trustItems = customTrust.length > 0 ? customTrust : defaultTrust

  if (loading) {
    return (
      <div className="bg-[#f7f4ef] min-h-[calc(100vh-4rem)]">
        <div className="bg-[#111110] -mt-20 pt-20 py-28">
          <Container>
            <Skeleton className="h-3 w-40 bg-white/10 mb-8" />
            <Skeleton className="h-16 w-2/3 bg-white/10 mb-6" />
            <Skeleton className="h-5 w-48 bg-white/10" />
          </Container>
        </div>
        <Container className="py-20">
          <SkeletonText lines={8} />
        </Container>
      </div>
    )
  }

  if (notFound || !service) {
    return <div className="bg-[#f7f4ef] py-32 text-center text-[#6b6b68]">404</div>
  }

  const price =
    formatPriceFrom(service.price_from, locale, service.price_label) ||
    t('services.price_on_request')

  const categoryHref = localizedPath(
    locale,
    service.category ? `${routes.services}?category=${service.category.slug}` : routes.services,
  )

  return (
    <div className="bg-[#f7f4ef] min-h-[calc(100vh-4rem)]">
      <Seo
        title={service.seo?.title || service.name}
        description={service.seo?.description || service.short_description || undefined}
      />

      {/* Cinematic hero — typography over atmosphere, no side card */}
      <section className="relative overflow-hidden bg-[#111110] text-white -mt-20 pt-20 min-h-[min(72svh,44rem)]">
        <Parallax speed={0.38} className="absolute inset-[-12%]">
          <div
            className="absolute inset-0 opacity-[0.38] bg-cover bg-center ken-burns"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-[#111110]/55 via-[#111110]/78 to-[#111110]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111110]/90 via-[#111110]/55 to-transparent" />

        <Container className="relative z-10 py-20 lg:py-28 xl:py-32 flex flex-col justify-end min-h-[min(62svh,38rem)]">
          <Reveal>
            <Link
              to={categoryHref}
              className="inline-flex text-[12px] uppercase tracking-[0.2em] text-white/45 hover:text-[#c8a97e] transition-colors mb-10"
            >
              ← {service.category?.name || t('nav.services')}
            </Link>
          </Reveal>

          <div className="max-w-5xl">
            <Reveal delay={60}>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-7">
                {service.category?.name && (
                  <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold">
                    {service.category.name}
                  </p>
                )}
                {service.is_featured && (
                  <span className="text-[11px] tracking-[0.22em] uppercase text-white/40">
                    {t('service.featured')}
                  </span>
                )}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <GoldRule className="mb-8 w-14" />
            </Reveal>
            <Reveal delay={160}>
              <h1 className="text-hero font-display font-normal mb-8">{service.name}</h1>
            </Reveal>
            {service.short_description && (
              <Reveal delay={240}>
                <p className="text-lead text-white/55 max-w-2xl mb-10">{service.short_description}</p>
              </Reveal>
            )}
            <Reveal delay={300}>
              <div className="flex flex-wrap items-end gap-8 lg:gap-12">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/35 mb-2">
                    {t('services.from')}
                  </p>
                  <p className="text-2xl md:text-3xl text-[#c8a97e] font-display">{price}</p>
                </div>
                <div className="flex flex-wrap gap-3 pb-1">
                  <a
                    href="#service-booking"
                    className="inline-flex bg-[#c8a97e] text-[#111110] px-8 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#d4b896] transition-colors"
                  >
                    {t('services.cta')}
                  </a>
                  <a
                    href={phoneHref}
                    className="inline-flex border border-white/25 px-8 py-4 text-[13px] font-bold uppercase tracking-wide hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Quiet trust line */}
      <section className="border-b border-[#111110]/08">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-8 lg:py-10">
            {trustItems.map((item, i) => (
              <Reveal key={i} delay={i * 70} className="flex items-baseline gap-4 md:max-w-xs">
                <span className="text-[11px] tracking-[0.28em] uppercase text-[#c8a97e] font-semibold shrink-0">
                  {item.label}
                </span>
                <span className="text-[14px] text-[#6b6b68] leading-snug">{item.text}</span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Editorial body + booking */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-16 xl:gap-20">
            <div className="lg:col-span-7 xl:col-span-8 space-y-20 lg:space-y-24">
              {(service.description || service.short_description) && (
                <Reveal>
                  <div className="max-w-2xl">
                    <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
                      {t('service.about')}
                    </p>
                    <h2 className="text-display font-display mb-8 leading-tight">
                      {service.about_title || t('service.about_title')}
                    </h2>
                    <div className="max-w-2xl">
                      <RichHtml html={service.description || service.short_description} />
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Journey — hairline list, not cards */}
              <div>
                <Reveal>
                  <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
                    {t('service.journey')}
                  </p>
                  <h2 className="text-display font-display mb-12 leading-tight max-w-xl">
                    {service.journey_title || t('service.journey_title')}
                  </h2>
                </Reveal>
                <ol>
                  {steps.map((step, i) => (
                    <Reveal key={step.n} delay={i * 60} as="li">
                      <div className="grid grid-cols-[auto_1fr] gap-6 lg:gap-10 py-8 border-t border-[#111110]/10 last:border-b">
                        <span className="text-[13px] font-mono tracking-wider text-[#c8a97e] pt-1">
                          {step.n}
                        </span>
                        <div className="max-w-xl">
                          <h3 className="text-xl md:text-2xl font-display mb-3">{step.title}</h3>
                          <p className="text-[15px] text-[#6b6b68] leading-relaxed">{step.text}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              </div>

              {/* Indications — split editorial columns */}
              {(service.indications || service.contraindications) && (
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 pt-2">
                  {service.indications && (
                    <Reveal>
                      <p className="text-[12px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-4">
                        {t('service.indications')}
                      </p>
                      <RichHtml
                        html={service.indications}
                        className="text-[15px] text-[#3a3834]"
                      />
                    </Reveal>
                  )}
                  {service.contraindications && (
                    <Reveal delay={80}>
                      <p className="text-[12px] tracking-[0.3em] uppercase text-[#9a958c] font-semibold mb-4">
                        {t('service.contraindications')}
                      </p>
                      <RichHtml
                        html={service.contraindications}
                        className="text-[15px] text-[#6b6b68]"
                      />
                    </Reveal>
                  )}
                </div>
              )}

              {/* Doctors — portrait row */}
              {service.doctors && service.doctors.length > 0 && (
                <div>
                  <Reveal>
                    <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
                      {t('doctors.eyebrow')}
                    </p>
                    <h2 className="text-display font-display mb-10">{t('service.doctors_title')}</h2>
                  </Reveal>
                  <ul className="space-y-0">
                    {service.doctors.map((d, i) => (
                      <Reveal key={d.id} delay={i * 50} as="li">
                        <Link
                          to={localizedPath(locale, routes.doctor(d.slug))}
                          className="group grid grid-cols-[5.5rem_1fr_auto] sm:grid-cols-[7rem_1fr_auto] gap-5 sm:gap-8 items-center py-6 border-t border-[#111110]/10 last:border-b"
                        >
                          <div className="aspect-[3/4] bg-[#161412] overflow-hidden">
                            {d.photo_url ? (
                              <img
                                src={d.photo_url}
                                alt={d.name}
                                className="w-full h-full object-cover object-top grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#1a1816]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display text-xl sm:text-2xl mb-1 group-hover:text-[#c8a97e] transition-colors">
                              {d.name}
                            </h3>
                            {d.position && (
                              <p className="text-[14px] text-[#6b6b68] leading-snug">{d.position}</p>
                            )}
                          </div>
                          <span className="text-[#111110]/25 group-hover:text-[#c8a97e] transition-colors text-xl">
                            →
                          </span>
                        </Link>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              )}

              {/* Portfolio cases for this service */}
              {service.portfolio && service.portfolio.length > 0 && (
                <div>
                  <Reveal>
                    <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
                      {t('portfolio.eyebrow')}
                    </p>
                    <h2 className="text-display font-display mb-10">{t('portfolio.title')}</h2>
                  </Reveal>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.portfolio.slice(0, 4).map((p, i) => (
                      <Reveal key={p.id} delay={i * 50}>
                        <Link
                          to={localizedPath(locale, routes.portfolioCase(p.slug))}
                          className="group relative block overflow-hidden bg-[#161412] aspect-[4/5]"
                        >
                          <img
                            src={portfolioCover(p)}
                            alt={p.title}
                            className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111110] via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <p className="text-[10px] tracking-[0.22em] uppercase text-[#c8a97e] mb-1">
                              {t('portfolio.before_after')}
                            </p>
                            <p className="text-white font-display text-lg">{p.title}</p>
                          </div>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {faq.length > 0 && (
                <div>
                  <Reveal>
                    <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
                      {t('faq.eyebrow')}
                    </p>
                    <h2 className="text-display font-display mb-10">{t('faq.title')}</h2>
                  </Reveal>
                  <div className="border-t border-[#111110]/10">
                    {faq.map((f, i) => (
                      <Reveal key={f.id} delay={Math.min(i * 40, 200)}>
                        <div className="border-b border-[#111110]/10">
                          <button
                            type="button"
                            className="w-full flex items-start justify-between gap-6 text-left py-6"
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            aria-expanded={openFaq === i}
                          >
                            <span className="font-display text-lg sm:text-xl leading-snug">
                              {f.question}
                            </span>
                            <span
                              className={`shrink-0 text-[#c8a97e] text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}
                            >
                              +
                            </span>
                          </button>
                          {openFaq === i && f.answer && (
                            <p className="pb-7 text-[15px] text-[#6b6b68] leading-relaxed max-w-2xl -mt-1">
                              {f.answer}
                            </p>
                          )}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky booking — quieter panel */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div
                id="service-booking"
                className="lg:sticky lg:top-24 bg-[#111110] text-white p-8 lg:p-10"
              >
                <Reveal>
                  <p className="text-[12px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-4">
                    {t('booking.eyebrow')}
                  </p>
                  <h2 className="font-display text-2xl lg:text-3xl mb-3 leading-tight">
                    {t('service.book_title')}
                  </h2>
                  <p className="text-white/50 text-[14px] mb-8 leading-relaxed">
                    {t('service.book_text')}
                  </p>
                  <div className="mb-8 pb-8 border-b border-white/10">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/35 mb-2 line-clamp-2">
                      {service.name}
                    </p>
                    <p className="text-[#c8a97e] font-display text-xl">{price}</p>
                  </div>
                  <LeadForm type="booking" defaultServiceSlug={service.slug} compact variant="dark" />
                  <a
                    href={phoneHref}
                    className="mt-6 flex items-center justify-center text-[12px] tracking-[0.16em] uppercase text-white/45 hover:text-[#c8a97e] transition-colors"
                  >
                    {phone}
                  </a>
                </Reveal>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Related — editorial list */}
      {related.length > 0 && (
        <section className="pb-24 lg:pb-32 border-t border-[#111110]/08">
          <Container className="pt-16 lg:pt-20">
            <Reveal>
              <div className="flex items-end justify-between gap-6 mb-12">
                <div>
                  <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-4">
                    {t('service.related_eyebrow')}
                  </p>
                  <h2 className="text-display font-display">{t('service.related_title')}</h2>
                </div>
                <Link
                  to={categoryHref}
                  className="hidden sm:inline text-[12px] font-bold uppercase tracking-wide border-b border-[#111110] pb-0.5 hover:text-[#c8a97e] hover:border-[#c8a97e] transition-colors"
                >
                  {t('common.view_all')}
                </Link>
              </div>
            </Reveal>
            <ul>
              {related.map((s, i) => (
                <Reveal key={s.id} delay={i * 50} as="li">
                  <Link
                    to={localizedPath(locale, routes.service(s.slug))}
                    className="group grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-10 items-baseline py-7 border-b border-[#111110]/10 hover:border-[#c8a97e]/40 transition-colors"
                  >
                    <h3 className="text-xl md:text-2xl font-display group-hover:text-[#c8a97e] transition-colors">
                      {s.name}
                    </h3>
                    <span className="text-[13px] text-[#9a958c] group-hover:text-[#c8a97e] transition-colors">
                      {formatPriceFrom(s.price_from, locale, s.price_label) ||
                        t('services.price_on_request')}{' '}
                      →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type { Service, ServiceCategory } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { formatPrice, formatPriceFrom } from '@/shared/lib/utils'
import { Seo } from '@/features/seo/Seo'
import { Container } from '@/shared/ui/layout'
import { PriceListSkeleton } from '@/shared/ui/Skeleton'
import { DarkCtaBand, PageHero, WarmPage } from '@/shared/ui/PageHero'
import { getCategoryVisual } from '@/features/services/categoryVisuals'

export function PricesPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [params] = useSearchParams()
  const categoryFilter = params.get('category') || undefined
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [cats, list] = await Promise.all([
          api.serviceCategories(locale),
          api.services(locale, { per_page: 100 }),
        ])
        if (cancelled) return
        setCategories(cats)
        setServices(list.data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [locale])

  const grouped = useMemo(() => {
    const bySlug = new Map<string, { category: ServiceCategory; items: Service[] }>()
    for (const c of categories) {
      bySlug.set(c.slug, { category: c, items: [] })
    }
    for (const s of services) {
      const slug = s.category?.slug
      if (!slug) continue
      if (categoryFilter && slug !== categoryFilter) continue
      const bucket = bySlug.get(slug)
      if (bucket) bucket.items.push(s)
      else if (s.category) bySlug.set(slug, { category: s.category, items: [s] })
    }
    return Array.from(bySlug.values()).filter((g) => g.items.length > 0)
  }, [categories, services, categoryFilter])

  return (
    <WarmPage>
      <Seo title={t('prices.title')} description={t('prices.subtitle')} />
      <PageHero
        eyebrow={t('prices.eyebrow')}
        title={t('prices.title')}
        subtitle={t('prices.subtitle')}
        art={1}
        image="https://images.unsplash.com/photo-1576091160550-2173dba07efd?w=1400&h=900&fit=crop&auto=format"
        actions={
          <>
            <Link
              to={localizedPath(locale, routes.booking)}
              className="inline-flex bg-[#c8a97e] text-[#111110] px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide hover:bg-[#b8966b] transition-colors"
            >
              {t('services.cta')}
            </Link>
            <Link
              to={localizedPath(locale, routes.services)}
              className="inline-flex border border-white/25 text-white px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
            >
              {t('nav.services')}
            </Link>
          </>
        }
      />

      <section className="py-12 lg:py-16">
        <Container size="content">
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              to={localizedPath(locale, routes.prices)}
              className={`px-4 py-2 text-[12px] font-semibold uppercase ${!categoryFilter ? 'bg-[#111110] text-white' : 'bg-white border border-[#e8e2d8]'}`}
            >
              {t('portfolio.all')}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={localizedPath(locale, `${routes.prices}?category=${c.slug}`)}
                className={`px-4 py-2 text-[12px] font-semibold uppercase ${categoryFilter === c.slug ? 'bg-[#111110] text-white' : 'bg-white border border-[#e8e2d8]'}`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {loading ? (
            <PriceListSkeleton />
          ) : grouped.length === 0 ? (
            <p className="text-[#6b6b68]">{t('prices.empty')}</p>
          ) : (
            <div className="space-y-8">
              {grouped.map(({ category, items }) => {
                const visual = getCategoryVisual(category.slug)
                return (
                  <section
                    key={category.id}
                    className="bg-white border border-[#e8e2d8] overflow-hidden"
                  >
                    <div className="relative px-6 py-6 border-b border-[#e8e2d8] overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-15 bg-cover bg-center"
                        style={{ backgroundImage: `url(${visual.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80" />
                      <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <div>
                          <p className="text-[11px] tracking-[0.25em] uppercase text-[#c8a97e] font-semibold mb-2">
                            {t('prices.group')}
                          </p>
                          <h2 className="text-2xl font-display">{category.name}</h2>
                          {category.description && (
                            <p className="text-sm text-[#6b6b68] mt-1">{category.description}</p>
                          )}
                        </div>
                        <Link
                          to={localizedPath(locale, `${routes.services}?category=${category.slug}`)}
                          className="text-[12px] font-bold uppercase tracking-wide border-b border-[#111110] self-start"
                        >
                          {t('prices.to_services')}
                        </Link>
                      </div>
                    </div>
                    <ul>
                      {items.map((s, i) => {
                        const price =
                          formatPriceFrom(s.price_from, locale, s.price_label) ||
                          (formatPrice(s.price_from, locale)
                            ? null
                            : t('services.price_on_request'))
                        return (
                          <li
                            key={s.id}
                            className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                              i < items.length - 1 ? 'border-b border-[#f0ebe3]' : ''
                            }`}
                          >
                            <div className="min-w-0">
                              <Link
                                to={localizedPath(locale, routes.service(s.slug))}
                                className="font-semibold text-[#111110] hover:text-[#c8a97e] transition-colors"
                              >
                                {s.name}
                              </Link>
                              {s.short_description && (
                                <p className="text-sm text-[#6b6b68] mt-1">{s.short_description}</p>
                              )}
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-wide whitespace-nowrap text-[#111110] sm:pl-6">
                              {price}
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                )
              })}
            </div>
          )}

          <p className="mt-8 text-sm text-[#6b6b68]">{t('prices.note')}</p>
        </Container>
      </section>

      <section className="pb-20">
        <Container size="content">
          <DarkCtaBand
            eyebrow={t('booking.eyebrow')}
            title={t('prices.cta_title')}
            text={t('prices.cta_text')}
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

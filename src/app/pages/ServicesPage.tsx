import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type { Service, ServiceCategory } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { formatPriceFrom } from '@/shared/lib/utils'
import { Seo } from '@/features/seo/Seo'
import { Container } from '@/shared/ui/layout'
import { GoldRule } from '@/features/services/ServiceArt'
import { getCategoryVisual } from '@/features/services/categoryVisuals'
import { Parallax, Reveal } from '@/shared/ui/motion'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { Locale } from '@/shared/config/locales'

function minPriceForCategory(catalog: Service[], slug: string): number | null {
  let min: number | null = null
  for (const s of catalog) {
    if (s.category?.slug !== slug || s.price_from == null) continue
    if (min == null || s.price_from < min) min = s.price_from
  }
  return min
}

/** Editorial services index — typography over card grids. */
export function ServicesPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [params] = useSearchParams()
  const category = params.get('category') || undefined
  const [catalog, setCatalog] = useState<Service[]>([])
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
        setCatalog(list.data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [locale])

  const services = useMemo(
    () => (category ? catalog.filter((s) => s.category?.slug === category) : catalog),
    [catalog, category],
  )

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === category),
    [categories, category],
  )

  const visual = getCategoryVisual(category)
  const title = activeCategory?.name || t('services.title')
  const subtitle = activeCategory?.description || t('services.page_subtitle')
  const showIndex = !category

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f7f4ef]">
      <Seo title={title} description={subtitle} />

      <section className="relative overflow-hidden bg-[#111110] text-white -mt-20 pt-20">
        <Parallax speed={0.35} className="absolute inset-[-10%]">
          <div
            className="absolute inset-0 opacity-[0.28] bg-cover bg-center ken-burns"
            style={{ backgroundImage: `url(${visual.image})` }}
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-[#111110]/70 via-[#111110]/85 to-[#111110]" />

        <Container className="relative z-10 py-24 lg:py-36 xl:py-40">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-[12px] tracking-[0.4em] uppercase text-[#c8a97e] font-semibold mb-8">
                {t('services.eyebrow')}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <GoldRule className="mb-8 w-14" />
            </Reveal>
            <Reveal delay={160}>
              <h1 className="text-hero font-display font-normal mb-8">{title}</h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="text-lead text-white/55 max-w-xl">{subtitle}</p>
            </Reveal>
            {category && (
              <Reveal delay={300}>
                <Link
                  to={localizedPath(locale, routes.services)}
                  className="inline-flex mt-10 text-[12px] tracking-[0.2em] uppercase text-white/45 hover:text-[#c8a97e] transition-colors"
                >
                  ← {t('nav.services')}
                </Link>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {showIndex ? (
        <section className="py-20 lg:py-28">
          <Container>
            <Reveal>
              <div className="flex items-baseline justify-between gap-6 mb-14 lg:mb-20 border-b border-[#111110]/10 pb-6">
                <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold">
                  {t('services.eyebrow')}
                </p>
                <Link
                  to={localizedPath(locale, routes.prices)}
                  className="text-[12px] tracking-[0.18em] uppercase font-semibold border-b border-[#111110] pb-0.5 hover:text-[#c8a97e] hover:border-[#c8a97e] transition-colors"
                >
                  {t('nav.prices')}
                </Link>
              </div>
            </Reveal>

            {loading ? (
              <div className="space-y-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <ul>
                {categories.map((c, i) => {
                  const price = minPriceForCategory(catalog, c.slug)
                  const featured = c.slug === 'endolift'
                  return (
                    <Reveal key={c.id} delay={i * 60} as="li">
                      <Link
                        to={localizedPath(locale, `${routes.services}?category=${c.slug}`)}
                        className="group grid grid-cols-[auto_1fr_auto] gap-6 lg:gap-12 items-baseline py-8 lg:py-10 border-b border-[#111110]/10 hover:border-[#c8a97e]/50 transition-colors"
                      >
                        <span className="text-[13px] font-mono tracking-wider text-[#c8a97e] w-8">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <h2
                            className={`font-display leading-tight transition-colors group-hover:text-[#c8a97e] ${
                              featured
                                ? 'text-3xl md:text-4xl lg:text-5xl'
                                : 'text-2xl md:text-3xl lg:text-4xl'
                            }`}
                          >
                            {c.name}
                          </h2>
                          {c.description && (
                            <p className="mt-3 text-[15px] md:text-[16px] text-[#6b6b68] max-w-xl leading-relaxed">
                              {c.description}
                            </p>
                          )}
                        </div>
                        <div className="hidden sm:flex flex-col items-end gap-3 shrink-0">
                          <span className="text-[12px] tracking-[0.16em] uppercase text-[#9a958c]">
                            {formatPriceFrom(price, locale) || t('services.price_on_request')}
                          </span>
                          <span className="text-xl text-[#111110]/30 group-hover:text-[#c8a97e] transition-colors">
                            →
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  )
                })}
              </ul>
            )}

            <Reveal delay={200}>
              <div className="mt-20 lg:mt-28 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
                <div className="max-w-md">
                  <p className="text-[12px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-3">
                    {t('services.consult_eyebrow')}
                  </p>
                  <p className="text-title font-display leading-tight mb-3">
                    {t('services.consult_title')}
                  </p>
                  <p className="text-[#6b6b68] leading-relaxed">{t('services.consult_text')}</p>
                </div>
                <Link
                  to={localizedPath(locale, routes.booking)}
                  className="inline-flex self-start bg-[#111110] text-white px-10 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#333] transition-colors"
                >
                  {t('services.cta')}
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>
      ) : (
        <CategoryServices
          loading={loading}
          services={services}
          categories={categories}
          category={category}
          locale={locale}
        />
      )}
    </div>
  )
}

function CategoryServices({
  loading,
  services,
  categories,
  category,
  locale,
}: {
  loading: boolean
  services: Service[]
  categories: ServiceCategory[]
  category?: string
  locale: Locale
}) {
  const { t } = useTranslation()

  return (
    <section className="py-16 lg:py-24">
      <Container size="content">
        <Reveal>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 mb-14 lg:mb-16 text-[12px] tracking-[0.16em] uppercase">
            <Link
              to={localizedPath(locale, routes.services)}
              className="text-[#9a958c] hover:text-[#111110] transition-colors"
            >
              {t('portfolio.all')}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={localizedPath(locale, `${routes.services}?category=${c.slug}`)}
                className={
                  category === c.slug
                    ? 'text-[#111110] border-b border-[#c8a97e] pb-0.5 font-semibold'
                    : 'text-[#9a958c] hover:text-[#111110] transition-colors'
                }
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </Reveal>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <p className="text-[#6b6b68] py-16">{t('services.empty')}</p>
        ) : (
          <ul>
            {services.map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i * 40, 280)} as="li">
                <Link
                  to={localizedPath(locale, routes.service(s.slug))}
                  className="group grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-10 items-baseline py-7 border-b border-[#111110]/10 hover:border-[#c8a97e]/40 transition-colors"
                >
                  <div>
                    <h2 className="text-xl md:text-2xl font-display leading-snug group-hover:text-[#c8a97e] transition-colors">
                      {s.name}
                    </h2>
                    {s.short_description && (
                      <p className="mt-2 text-[14px] md:text-[15px] text-[#6b6b68] leading-relaxed max-w-2xl">
                        {s.short_description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-6 sm:justify-end">
                    <span className="text-[13px] md:text-[14px] font-semibold tracking-wide whitespace-nowrap">
                      {formatPriceFrom(s.price_from, locale, s.price_label) ||
                        t('services.price_on_request')}
                    </span>
                    <span className="text-[#111110]/25 group-hover:text-[#c8a97e] transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}

        <Reveal delay={120}>
          <div className="mt-16 flex flex-wrap gap-4">
            <Link
              to={localizedPath(locale, routes.booking)}
              className="inline-flex bg-[#111110] text-white px-9 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#333] transition-colors"
            >
              {t('services.cta')}
            </Link>
            <Link
              to={localizedPath(locale, routes.prices + (category ? `?category=${category}` : ''))}
              className="inline-flex border border-[#111110] px-9 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#111110] hover:text-white transition-colors"
            >
              {t('nav.prices')}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

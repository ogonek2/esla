import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type { PortfolioCase } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Seo } from '@/features/seo/Seo'
import { Container } from '@/shared/ui/layout'
import { Skeleton } from '@/shared/ui/Skeleton'
import { DarkCtaBand, PageHero, WarmPage } from '@/shared/ui/PageHero'
import { AmbientGlow, GoldRule, ServiceArt } from '@/features/services/ServiceArt'
import { getCategoryVisual } from '@/features/services/categoryVisuals'

export function PortfolioPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [cases, setCases] = useState<PortfolioCase[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.portfolio(locale)
        if (!cancelled) setCases(res.data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [locale])

  const categories = useMemo(() => {
    const set = new Set<string>()
    cases.forEach((c) => {
      if (c.service?.name) set.add(c.service.name)
    })
    return Array.from(set)
  }, [cases])

  const filtered =
    filter === 'all' ? cases : cases.filter((c) => c.service?.name === filter)

  return (
    <WarmPage>
      <Seo title={t('portfolio.title')} description={t('portfolio.page_subtitle')} />
      <PageHero
        eyebrow={t('portfolio.eyebrow')}
        title={t('portfolio.title')}
        subtitle={t('portfolio.page_subtitle')}
        art={2}
        image="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1400&h=900&fit=crop&auto=format"
        actions={
          <Link
            to={localizedPath(locale, routes.booking)}
            className="inline-flex bg-[#c8a97e] text-[#111110] px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide hover:bg-[#b8966b] transition-colors"
          >
            {t('services.cta')}
          </Link>
        }
      />

      <section className="py-12 lg:py-16">
        <Container>
          {(categories.length > 0 || !loading) && (
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-wide transition-colors ${
                  filter === 'all'
                    ? 'bg-[#111110] text-white'
                    : 'bg-white border border-[#e8e2d8] text-[#6b6b68] hover:border-[#111110]'
                }`}
              >
                {t('portfolio.all')}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-wide transition-colors ${
                    filter === c
                      ? 'bg-[#111110] text-white'
                      : 'bg-white border border-[#e8e2d8] text-[#6b6b68] hover:border-[#111110]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="max-w-[160px] mx-auto mb-8 opacity-70">
                <ServiceArt variant={2} tone="soft" />
              </div>
              <p className="text-[#6b6b68]">{t('portfolio.empty')}</p>
              <p className="text-sm text-[#9a958c] mt-2">{t('portfolio.empty_hint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {filtered.map((c) => {
                const img = c.after_url || c.before_url
                    const visual = getCategoryVisual(
                      (c.service as { category?: { slug?: string } } | null)?.category?.slug,
                    )
                return (
                  <Link
                    key={c.id}
                    to={localizedPath(locale, routes.portfolioCase(c.slug))}
                    className="group relative overflow-hidden bg-[#161412] min-h-[16rem]"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={c.title}
                        className="w-full h-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div
                        className="w-full aspect-[4/5] bg-cover bg-center opacity-50"
                        style={{ backgroundImage: `url(${visual.image})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111110] via-[#111110]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                      <p className="text-[10px] tracking-[0.22em] uppercase text-[#c8a97e] font-semibold mb-1">
                        {t('portfolio.before_after')}
                      </p>
                      <p className="text-white font-display text-lg leading-snug">{c.title}</p>
                      {c.service?.name && (
                        <p className="text-white/50 text-xs mt-1">{c.service.name}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
          <p className="mt-10 text-center text-xs text-[#9a958c]">{t('portfolio.consent')}</p>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <DarkCtaBand
            eyebrow={t('booking.eyebrow')}
            title={t('portfolio.cta_title')}
            text={t('portfolio.cta_text')}
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

export function PortfolioDetailPage() {
  const { slug = '' } = useParams()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [item, setItem] = useState<PortfolioCase | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.portfolioCase(slug, locale)
        if (!cancelled) setItem(data)
      } catch {
        if (!cancelled) setItem(null)
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
        <Container className="py-24">
          <Skeleton className="h-10 w-2/3 mb-8" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="aspect-[4/5]" />
            <Skeleton className="aspect-[4/5]" />
          </div>
        </Container>
      </WarmPage>
    )
  }

  if (!item) {
    return (
      <WarmPage>
        <p className="py-32 text-center text-[#6b6b68]">404</p>
      </WarmPage>
    )
  }

  const visual = getCategoryVisual(item.service?.category?.slug)

  return (
    <WarmPage>
      <Seo title={item.title} description={item.description || undefined} />

      <section className="relative overflow-hidden bg-[#111110] text-white -mt-20 pt-20">
        <AmbientGlow />
        <Container className="relative z-10 py-14 lg:py-20">
          <Link
            to={localizedPath(locale, routes.portfolio)}
            className="inline-flex text-[12px] uppercase tracking-[0.18em] text-white/55 hover:text-[#c8a97e] transition-colors mb-8"
          >
            ← {t('nav.portfolio')}
          </Link>
          <p className="text-[11px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-4">
            {t('portfolio.before_after')}
          </p>
          <GoldRule className="mb-5" />
          <h1 className="text-4xl lg:text-5xl font-display mb-4 max-w-3xl">{item.title}</h1>
          {item.service && (
            <Link
              to={localizedPath(locale, routes.service(item.service.slug))}
              className="text-white/60 hover:text-[#c8a97e] transition-colors text-sm"
            >
              {item.service.name} →
            </Link>
          )}
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container size="content">
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <figure className="bg-[#161412] overflow-hidden">
              {item.before_url ? (
                <img src={item.before_url} alt="" className="w-full aspect-[4/5] object-cover" />
              ) : (
                <div
                  className="w-full aspect-[4/5] bg-cover bg-center opacity-40"
                  style={{ backgroundImage: `url(${visual.image})` }}
                />
              )}
              <figcaption className="px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-[#c8a97e] bg-[#111110]">
                {t('portfolio.before')}
              </figcaption>
            </figure>
            <figure className="bg-[#161412] overflow-hidden">
              {item.after_url ? (
                <img src={item.after_url} alt="" className="w-full aspect-[4/5] object-cover" />
              ) : (
                <div
                  className="w-full aspect-[4/5] bg-cover bg-center opacity-55"
                  style={{ backgroundImage: `url(${visual.image})` }}
                />
              )}
              <figcaption className="px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-[#c8a97e] bg-[#111110]">
                {t('portfolio.after')}
              </figcaption>
            </figure>
          </div>

          {item.description && (
            <p className="text-[#3a3834] whitespace-pre-wrap leading-relaxed text-[16px] max-w-2xl mb-8">
              {item.description}
            </p>
          )}

          {item.doctor && (
            <Link
              to={localizedPath(locale, routes.doctor(item.doctor.slug))}
              className="inline-flex text-sm font-semibold border-b border-[#111110] hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
            >
              {item.doctor.name}
            </Link>
          )}

          <p className="mt-10 text-xs text-[#9a958c]">{t('portfolio.consent')}</p>

          <div className="mt-12">
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

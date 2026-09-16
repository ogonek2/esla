import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type {
  Doctor,
  FaqItem,
  PortfolioCase,
  Post,
  Review,
  Service,
  ServiceCategory,
} from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { Seo } from '@/features/seo/Seo'
import { HeroSection } from '@/features/clinic/HeroSection'
import { EndoliftSection } from '@/features/services/EndoliftSection'
import { ServicesSection } from '@/features/services/ServicesSection'
import { DoctorsSection } from '@/features/doctors/DoctorsSection'
import { WhyEslaSection } from '@/features/clinic/WhyEslaSection'
import { PortfolioSection } from '@/features/portfolio/PortfolioSection'
import { ReviewsSection } from '@/features/reviews/ReviewsSection'
import { BlogSection } from '@/features/blog/BlogSection'
import { FaqSection } from '@/features/faq/FaqSection'
import { BookingSection } from '@/features/booking/BookingSection'
import { ContactsSection } from '@/features/clinic/ContactsSection'
import { FinalCta } from '@/features/clinic/FinalCta'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { telHref } from '@/shared/lib/utils'
import { HomeSkeleton } from '@/shared/ui/Skeleton'

async function settledData<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise
  } catch {
    return fallback
  }
}

type HomeBundle = {
  categories: ServiceCategory[]
  services: Service[]
  featured: Service[]
  doctors: Doctor[]
  portfolio: PortfolioCase[]
  reviews: Review[]
  posts: Post[]
  faq: FaqItem[]
}

export function HomePage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phone } = useClinic()
  const [bundle, setBundle] = useState<HomeBundle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setError(false)
      // Keep previous content while soft-refreshing on locale change if we already have data
      if (!bundle) setLoading(true)
      try {
        const [cats, allServices, featuredRes, docs, port, revs, blog, faqs] = await Promise.all([
          api.serviceCategories(locale),
          api.services(locale, { per_page: 100 }),
          settledData(api.services(locale, { featured: true, per_page: 20 }), {
            data: [] as Service[],
          }),
          settledData(api.doctors(locale), { data: [] as Doctor[] }),
          settledData(api.portfolio(locale), { data: [] as PortfolioCase[] }),
          settledData(api.reviews(locale), { data: [] as Review[] }),
          settledData(api.posts(locale, 3), { data: [] as Post[] }),
          settledData(api.faq(locale), [] as FaqItem[]),
        ])
        if (cancelled) return
        setBundle({
          categories: cats,
          services: allServices.data,
          featured: featuredRes.data,
          doctors: docs.data,
          portfolio: port.data,
          reviews: revs.data,
          posts: blog.data,
          faq: faqs,
        })
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: reload on locale; bundle omit avoids loop
  }, [locale])

  const minPrices = useMemo(() => {
    const map: Record<string, number | null> = {}
    for (const s of bundle?.services || []) {
      const slug = s.category?.slug
      if (!slug || s.price_from == null) continue
      if (map[slug] == null || (map[slug] as number) > s.price_from) {
        map[slug] = s.price_from
      }
    }
    return map
  }, [bundle?.services])

  if (error && !bundle) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <Seo title={t('common.error_title')} />
        <h1 className="text-3xl font-display mb-4">{t('common.error_title')}</h1>
        <p className="text-[#6b6b68] mb-8">{t('common.error_text')}</p>
        <a
          href={telHref(phone)}
          className="inline-flex bg-[#111110] text-white px-6 py-3 text-sm font-bold uppercase"
        >
          {phone}
        </a>
      </div>
    )
  }

  if (loading && !bundle) {
    return (
      <>
        <Seo description={t('hero.subtitle')} />
        <HeroSection />
        <HomeSkeleton />
      </>
    )
  }

  const data = bundle!

  return (
    <>
      <Seo description={t('hero.subtitle')} />
      <HeroSection />
      <EndoliftSection featured={data.featured} />
      <ServicesSection categories={data.categories} minPrices={minPrices} />
      <DoctorsSection doctors={data.doctors} />
      <WhyEslaSection />
      <PortfolioSection cases={data.portfolio} />
      <ReviewsSection reviews={data.reviews} />
      <BlogSection posts={data.posts} />
      <FaqSection items={data.faq} />
      <BookingSection services={data.services} />
      <ContactsSection />
      <FinalCta />
    </>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type { Page, Post } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Seo } from '@/features/seo/Seo'
import { Container } from '@/shared/ui/layout'
import { CardGridSkeleton, Skeleton, SkeletonText } from '@/shared/ui/Skeleton'
import { DarkCtaBand, PageHero, WarmPage } from '@/shared/ui/PageHero'
import { AmbientGlow, GoldRule, ServiceArt } from '@/features/services/ServiceArt'
import { PostContent } from '@/features/blog/PostContent'
import { RichHtml } from '@/shared/ui/RichHtml'

export function BlogPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.posts(locale)
        if (!cancelled) setPosts(res.data)
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
      <Seo title={t('blog.title')} description={t('blog.page_subtitle')} />
      <PageHero
        eyebrow={t('blog.eyebrow')}
        title={t('blog.title')}
        subtitle={t('blog.page_subtitle')}
        art={1}
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=900&fit=crop&auto=format"
      />

      <section className="py-14 lg:py-20">
        <Container>
          {loading ? (
            <CardGridSkeleton count={3} />
          ) : posts.length === 0 ? (
            <p className="text-center text-[#6b6b68] py-16">{t('blog.empty')}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((p, i) => (
                <Link
                  key={p.id}
                  to={localizedPath(locale, routes.post(p.slug))}
                  className="group bg-white border border-[#e8e2d8] overflow-hidden hover:border-[#c8a97e]/60 hover:shadow-[0_18px_40px_-28px_rgba(17,17,16,0.35)] transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-44 bg-[#161412] overflow-hidden">
                    {p.cover_url ? (
                      <img
                        src={p.cover_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 p-8 opacity-80">
                        <ServiceArt variant={(i % 4) as 0 | 1 | 2 | 3} tone="gold" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111110]/50 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    {p.published_at && (
                      <p className="text-[11px] tracking-[0.18em] uppercase text-[#c8a97e] font-semibold mb-3">
                        {new Date(p.published_at).toLocaleDateString(locale)}
                      </p>
                    )}
                    <h2 className="font-display text-xl mb-3 leading-snug group-hover:text-[#111110]">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="text-sm text-[#6b6b68] line-clamp-3 leading-relaxed mb-5 flex-1">
                        {p.excerpt}
                      </p>
                    )}
                    <span className="text-[12px] font-bold uppercase tracking-wide border-b border-[#111110] self-start pb-0.5 group-hover:border-[#c8a97e] group-hover:text-[#c8a97e] transition-colors">
                      {t('blog.read')} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </WarmPage>
  )
}

export function BlogPostPage() {
  const { slug = '' } = useParams()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.post(slug, locale)
        if (!cancelled) setPost(data)
      } catch {
        if (!cancelled) setPost(null)
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
        <Container size="narrow" className="py-24">
          <Skeleton className="h-4 w-24 mb-6" />
          <Skeleton className="h-12 w-4/5 mb-8" />
          <SkeletonText lines={10} />
        </Container>
      </WarmPage>
    )
  }

  if (!post) {
    return (
      <WarmPage>
        <p className="py-32 text-center">404</p>
      </WarmPage>
    )
  }

  const blocks = Array.isArray(post.blocks) ? post.blocks : []
  const hasBlocks = blocks.length > 0

  return (
    <WarmPage>
      <Seo
        title={post.seo?.title || post.title}
        description={post.seo?.description || post.excerpt || undefined}
      />

      <section className="relative overflow-hidden bg-[#111110] text-white -mt-20 pt-20">
        <AmbientGlow />
        {post.cover_url && (
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.cover_url})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111110]/70 to-[#111110]" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 sm:px-8 pt-6 pb-8 md:pt-8 md:pb-10">
          <Link
            to={localizedPath(locale, routes.blog)}
            className="inline-flex text-[12px] uppercase tracking-[0.18em] text-white/55 hover:text-[#c8a97e] transition-colors mb-4"
          >
            ← {t('nav.blog')}
          </Link>
          <p className="text-[11px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-3">
            {t('blog.eyebrow')}
          </p>
          <GoldRule className="mb-4" />
          <h1 className="text-4xl lg:text-5xl font-display leading-tight mb-3">{post.title}</h1>
          {post.published_at && (
            <p className="text-white/45 text-sm">
              {new Date(post.published_at).toLocaleDateString(locale)}
            </p>
          )}
        </div>
      </section>

      <section className="py-14 lg:py-20 overflow-x-clip">
        {post.excerpt && (
          <p className="mx-auto w-full max-w-5xl px-5 sm:px-8 text-xl text-[#6b6b68] leading-relaxed mb-10 font-light">
            {post.excerpt}
          </p>
        )}

        {hasBlocks ? (
          <PostContent blocks={blocks} />
        ) : post.body ? (
          <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
            <RichHtml html={post.body} />
          </div>
        ) : (
          <div className="px-5 sm:px-8">
            <PostContent blocks={[]} />
          </div>
        )}

        <div className="mx-auto w-full max-w-5xl px-5 sm:px-8 mt-14 pt-10 border-t border-[#e8e2d8]">
          <Link
            to={localizedPath(locale, routes.booking)}
            className="inline-flex bg-[#111110] text-white px-8 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#333] transition-colors"
          >
            {t('services.cta')}
          </Link>
        </div>
      </section>
    </WarmPage>
  )
}

export function StaticPage() {
  const { slug = '' } = useParams()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.page(slug, locale)
        if (!cancelled) setPage(data)
      } catch {
        if (!cancelled) setPage(null)
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
        <Container size="narrow" className="py-24">
          <Skeleton className="h-12 w-2/3 mb-8" />
          <SkeletonText lines={8} />
        </Container>
      </WarmPage>
    )
  }

  if (!page) {
    return (
      <WarmPage>
        <p className="py-32 text-center">404</p>
      </WarmPage>
    )
  }

  return (
    <WarmPage>
      <Seo title={page.seo?.title || page.title} description={page.seo?.description || undefined} />
      <PageHero
        eyebrow={t('footer.legal')}
        title={page.title}
        art={3}
        compact
        image="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&h=800&fit=crop&auto=format"
      />
      <section className="py-14 lg:py-20">
        <Container size="narrow">
          {page.body && (
            <div className="whitespace-pre-wrap leading-[1.8] text-[#3a3834] text-[16px]">
              {page.body}
            </div>
          )}
          <div className="mt-14">
            <DarkCtaBand
              eyebrow={t('contacts.eyebrow')}
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
          </div>
        </Container>
      </section>
    </WarmPage>
  )
}

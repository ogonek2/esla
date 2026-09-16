import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Post } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Container, Section, SectionHeader } from '@/shared/ui/layout'
import { ServiceArt } from '@/features/services/ServiceArt'

export function BlogSection({ posts }: { posts: Post[] }) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const list = posts.slice(0, 3)

  if (!list.length) return null

  return (
    <Section id="blog" className="bg-[#f7f4ef]">
      <Container>
        <SectionHeader
          eyebrow={t('blog.eyebrow')}
          title={t('blog.title')}
          action={
            <Link
              to={localizedPath(locale, routes.blog)}
              className="hidden sm:inline text-[12px] font-bold uppercase tracking-wide border-b border-[#111110]"
            >
              {t('common.view_all')}
            </Link>
          }
        />
        <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
          {list.map((p, i) => (
            <Link
              key={p.id}
              to={localizedPath(locale, routes.post(p.slug))}
              className="group border border-[#e8e2d8] bg-white hover:border-[#c8a97e]/60 transition-colors overflow-hidden flex flex-col"
            >
              <div className="relative h-36 bg-[#161412] overflow-hidden">
                {p.cover_url ? (
                  <img
                    src={p.cover_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 p-6 opacity-80">
                    <ServiceArt variant={(i % 4) as 0 | 1 | 2 | 3} tone="gold" />
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-semibold text-lg mb-2 font-display leading-snug">{p.title}</h3>
                {p.excerpt && (
                  <p className="text-sm text-[#6b6b68] line-clamp-3 leading-relaxed mt-auto">
                    {p.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}

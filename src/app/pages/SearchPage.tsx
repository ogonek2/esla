import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '@/shared/lib/api'
import type { SearchResult } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Seo } from '@/features/seo/Seo'
import { Container } from '@/shared/ui/layout'
import { Skeleton } from '@/shared/ui/Skeleton'
import { PageHero, WarmPage } from '@/shared/ui/PageHero'

export function SearchPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [input, setInput] = useState(q)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInput(q)
    if (q.trim().length < 2) {
      setResult(null)
      setError(q ? t('search.min') : null)
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.search(q, locale)
        if (!cancelled) setResult(res)
      } catch {
        if (!cancelled) setError(t('common.error_text'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [q, locale, t])

  return (
    <WarmPage>
      <Seo title={t('search.title')} />
      <PageHero
        eyebrow={t('nav.search')}
        title={t('search.title')}
        subtitle={t('search.page_subtitle')}
        art={1}
        compact
      />

      <section className="py-12 lg:py-16">
        <Container size="narrow">
          <form
            className="flex flex-col sm:flex-row gap-2 mb-10"
            onSubmit={(e) => {
              e.preventDefault()
              setParams(input ? { q: input } : {})
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('search.placeholder')}
              className="flex-1 border border-[#e8e2d8] bg-white px-4 py-3.5 focus:outline-none focus:border-[#c8a97e]"
            />
            <button
              type="submit"
              className="bg-[#111110] text-white px-8 py-3.5 font-bold uppercase text-[13px] tracking-wide hover:bg-[#333] transition-colors"
            >
              {t('nav.search')}
            </button>
          </form>

          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/5" />
            </div>
          )}
          {error && <p className="text-[#6b6b68]">{error}</p>}

          {result && (
            <div className="space-y-10">
              <ResultGroup
                title={t('nav.services')}
                items={result.data.services.map((s) => ({
                  id: s.id,
                  label: s.name,
                  to: localizedPath(locale, routes.service(s.slug)),
                }))}
                empty={t('search.empty')}
              />
              <ResultGroup
                title={t('nav.doctors')}
                items={result.data.doctors.map((d) => ({
                  id: d.id,
                  label: d.name,
                  to: localizedPath(locale, routes.doctor(d.slug)),
                }))}
                empty={t('search.empty')}
              />
              <ResultGroup
                title={t('nav.blog')}
                items={result.data.posts.map((p) => ({
                  id: p.id,
                  label: p.title,
                  to: localizedPath(locale, routes.post(p.slug)),
                }))}
                empty={t('search.empty')}
              />
              <ResultGroup
                title={t('nav.faq')}
                items={result.data.faq.map((f) => ({
                  id: f.id,
                  label: f.question,
                  to: localizedPath(locale, routes.faq),
                }))}
                empty={t('search.empty')}
              />
            </div>
          )}
        </Container>
      </section>
    </WarmPage>
  )
}

function ResultGroup({
  title,
  items,
  empty,
}: {
  title: string
  items: { id: number; label: string; to: string }[]
  empty: string
}) {
  return (
    <section className="bg-white border border-[#e8e2d8] p-6">
      <h2 className="text-[11px] uppercase tracking-[0.25em] text-[#c8a97e] font-semibold mb-4">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-[#6b6b68]">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={item.to}
                className="text-[#111110] border-b border-[#111110]/30 hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

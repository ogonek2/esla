import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from '@/shared/config/site'
import { useLocale } from '@/shared/lib/locale'

type SeoProps = {
  title?: string
  description?: string
  image?: string | null
  type?: 'website' | 'article'
  noindex?: boolean
  /** Absolute or site-relative canonical path; defaults to current URL */
  canonical?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[] | null
}

function absUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_URL}${path}`
}

function ensureMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}

function ensureLink(rel: string, href: string, attrs: Record<string, string> = {}) {
  const key = attrs.hreflang
    ? `link[rel="${rel}"][hreflang="${attrs.hreflang}"]`
    : `link[rel="${rel}"]`
  let el = document.head.querySelector(key) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v)
  }
}

function ensureJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.text = JSON.stringify(data)
}

export function Seo({
  title,
  description,
  image,
  type = 'website',
  noindex,
  canonical,
  jsonLd,
}: SeoProps) {
  const location = useLocation()
  const { locale } = useLocale()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
    const desc = description || DEFAULT_DESCRIPTION
    const ogImage = image ? absUrl(image) : DEFAULT_OG_IMAGE
    const pageUrl = absUrl(canonical || location.pathname + location.search)

    document.title = fullTitle
    document.documentElement.lang = locale === 'uk' ? 'uk' : locale

    ensureMeta('description', desc)
    ensureMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')
    ensureMeta('theme-color', '#111110')
    ensureMeta('author', SITE_NAME)

    // Open Graph
    ensureMeta('og:site_name', SITE_NAME, true)
    ensureMeta('og:type', type, true)
    ensureMeta('og:title', fullTitle, true)
    ensureMeta('og:description', desc, true)
    ensureMeta('og:url', pageUrl, true)
    ensureMeta('og:image', ogImage, true)
    ensureMeta('og:image:alt', fullTitle, true)
    ensureMeta('og:locale', locale === 'uk' ? 'uk_UA' : locale === 'ru' ? 'ru_UA' : 'en_US', true)

    // Twitter
    ensureMeta('twitter:card', 'summary_large_image')
    ensureMeta('twitter:title', fullTitle)
    ensureMeta('twitter:description', desc)
    ensureMeta('twitter:image', ogImage)

    ensureLink('canonical', pageUrl.split('?')[0])

    // hreflang alternates for the same path without locale prefix
    const path = location.pathname.replace(/^\/(en|ru)(?=\/|$)/, '') || '/'
    ensureLink('alternate', absUrl(path === '/' ? '/' : path), { hreflang: 'uk' })
    ensureLink('alternate', absUrl(path === '/' ? '/en' : `/en${path}`), { hreflang: 'en' })
    ensureLink('alternate', absUrl(path === '/' ? '/ru' : `/ru${path}`), { hreflang: 'ru' })
    ensureLink('alternate', absUrl(path === '/' ? '/' : path), { hreflang: 'x-default' })

    if (jsonLd) {
      ensureJsonLd('esla-jsonld', jsonLd)
    } else {
      document.getElementById('esla-jsonld')?.remove()
    }
  }, [title, description, image, type, noindex, canonical, jsonLd, location.pathname, location.search, locale])

  return null
}

/** Organization / MedicalClinic JSON-LD for the homepage. */
export function homeJsonLd(opts?: {
  phone?: string
  email?: string | null
  address?: string | null
  sameAs?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: 'ESLA',
    url: SITE_URL,
    logo: `${SITE_URL}/android-chrome-512.png`,
    image: DEFAULT_OG_IMAGE,
    description: DEFAULT_DESCRIPTION,
    telephone: opts?.phone || undefined,
    email: opts?.email || undefined,
    address: opts?.address
      ? {
          '@type': 'PostalAddress',
          addressLocality: opts.address,
          addressCountry: 'UA',
        }
      : undefined,
    sameAs: opts?.sameAs?.length ? opts.sameAs : undefined,
    medicalSpecialty: ['PlasticSurgery', 'Otolaryngology', 'Dermatology'],
  }
}

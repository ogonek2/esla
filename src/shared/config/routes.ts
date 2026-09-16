import { DEFAULT_LOCALE, type Locale } from './locales'

/** Build path with as-needed locale prefix (uk has no prefix). */
export function localizedPath(locale: Locale, path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) {
    return normalized === '' ? '/' : normalized
  }
  if (normalized === '/') {
    return `/${locale}`
  }
  return `/${locale}${normalized}`
}

export const routes = {
  home: '/',
  services: '/services',
  service: (slug: string) => `/services/${slug}`,
  endolift: '/endolift',
  prices: '/prices',
  doctors: '/doctors',
  doctor: (slug: string) => `/doctors/${slug}`,
  portfolio: '/portfolio',
  portfolioCase: (slug: string) => `/portfolio/${slug}`,
  reviews: '/reviews',
  faq: '/faq',
  blog: '/blog',
  post: (slug: string) => `/blog/${slug}`,
  booking: '/booking',
  contacts: '/contacts',
  search: '/search',
  page: (slug: string) => `/pages/${slug}`,
} as const

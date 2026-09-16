import type { Locale } from '@/shared/config/locales'
import { CACHE_TTL, cacheGet, cacheKey, cacheSet } from '@/shared/lib/cache'
import type {
  Clinic,
  Doctor,
  FaqItem,
  LeadPayload,
  LeadResponse,
  Page,
  Paginated,
  PortfolioCase,
  Post,
  Review,
  SearchResult,
  Service,
  ServiceCategory,
  ServiceDetailResponse,
} from './types'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
  || (import.meta.env.DEV ? '/api/v1' : 'http://127.0.0.1:1212/api/v1')

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

type RequestOptions = {
  locale?: Locale
  method?: string
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  cache?: boolean | number
  /** Force network even if cache exists */
  bypassCache?: boolean
}

const inflight = new Map<string, Promise<unknown>>()

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase()
  const locale = options.locale || 'uk'
  const base =
    typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:5173'
  const url = new URL(
    `${API_URL}${path.startsWith('/') ? path : `/${path}`}`,
    base,
  )
  url.searchParams.set('locale', locale)

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const useCache = method === 'GET' && options.cache !== false
  const ttl = typeof options.cache === 'number' ? options.cache : CACHE_TTL.default
  const key = cacheKey(['api', method, url.pathname, url.search])

  if (useCache && !options.bypassCache) {
    const hit = cacheGet<T>(key)
    if (hit != null) return hit
    const pending = inflight.get(key)
    if (pending) return pending as Promise<T>
  }

  const run = (async () => {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        Accept: 'application/json',
        'Accept-Language': locale,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const json = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new ApiError(
        (json as { message?: string }).message || 'Request failed',
        response.status,
        (json as { errors?: Record<string, string[]> }).errors,
      )
    }

    const data = json as T
    if (useCache) cacheSet(key, data, ttl)
    return data
  })()

  if (useCache) {
    inflight.set(key, run)
    try {
      return await run
    } finally {
      inflight.delete(key)
    }
  }

  return run
}

/** Stale-while-revalidate helper for UI hooks */
export async function cachedFetch<T>(
  keyParts: Array<string | number | boolean | null | undefined>,
  fetcher: () => Promise<T>,
  ttl = CACHE_TTL.default,
): Promise<{ data: T; fromCache: boolean }> {
  const key = cacheKey(keyParts)
  const hit = cacheGet<T>(key)
  if (hit != null) {
    void fetcher()
      .then((fresh) => cacheSet(key, fresh, ttl))
      .catch(() => undefined)
    return { data: hit, fromCache: true }
  }
  const data = await fetcher()
  cacheSet(key, data, ttl)
  return { data, fromCache: false }
}

export const api = {
  clinic: (locale?: Locale) =>
    request<{ data: Clinic }>('/clinic', { locale, cache: CACHE_TTL.long }).then((r) => r.data),

  serviceCategories: (locale?: Locale) =>
    request<{ data: ServiceCategory[] }>('/service-categories', {
      locale,
      cache: CACHE_TTL.default,
    }).then((r) => r.data),

  services: (locale?: Locale, query?: { category?: string; featured?: boolean; per_page?: number }) =>
    request<Paginated<Service>>('/services', {
      locale,
      cache: CACHE_TTL.default,
      query: {
        category: query?.category,
        featured: query?.featured ? 1 : undefined,
        per_page: query?.per_page ?? 50,
      },
    }),

  service: (slug: string, locale?: Locale) =>
    request<ServiceDetailResponse>(`/services/${slug}`, { locale, cache: CACHE_TTL.default }),

  doctors: (locale?: Locale, perPage = 50) =>
    request<Paginated<Doctor>>('/doctors', {
      locale,
      cache: CACHE_TTL.default,
      query: { per_page: perPage },
    }),

  doctor: (slug: string, locale?: Locale) =>
    request<{ data: Doctor }>(`/doctors/${slug}`, { locale, cache: CACHE_TTL.default }).then(
      (r) => r.data,
    ),

  portfolio: (locale?: Locale, query?: { service?: string; doctor?: string; per_page?: number }) =>
    request<Paginated<PortfolioCase>>('/portfolio', {
      locale,
      cache: CACHE_TTL.default,
      query: { ...query, per_page: query?.per_page ?? 50 },
    }),

  portfolioCase: (slug: string, locale?: Locale) =>
    request<{ data: PortfolioCase }>(`/portfolio/${slug}`, {
      locale,
      cache: CACHE_TTL.default,
    }).then((r) => r.data),

  reviews: (locale?: Locale, perPage = 50) =>
    request<Paginated<Review>>('/reviews', {
      locale,
      cache: CACHE_TTL.default,
      query: { per_page: perPage },
    }),

  faq: (locale?: Locale, category?: string) =>
    request<{ data: FaqItem[] }>('/faq', {
      locale,
      cache: CACHE_TTL.long,
      query: { category },
    }).then((r) => r.data),

  posts: (locale?: Locale, perPage = 20) =>
    request<Paginated<Post>>('/posts', {
      locale,
      cache: CACHE_TTL.default,
      query: { per_page: perPage },
    }),

  post: (slug: string, locale?: Locale) =>
    request<{ data: Post }>(`/posts/${slug}`, {
      locale,
      // Article body/blocks change in admin — never serve a stale constructor payload
      cache: false,
      bypassCache: true,
      query: { detailed: 1 },
    }).then((r) => r.data),

  page: (slug: string, locale?: Locale) =>
    request<{ data: Page }>(`/pages/${slug}`, { locale, cache: CACHE_TTL.long }).then((r) => r.data),

  search: (q: string, locale?: Locale) =>
    request<SearchResult>('/search', { locale, query: { q }, cache: CACHE_TTL.short }),

  lead: (type: 'consultation' | 'booking' | 'feedback', payload: LeadPayload, locale?: Locale) =>
    request<LeadResponse>(`/leads/${type}`, {
      method: 'POST',
      locale,
      cache: false,
      body: { ...payload, website: payload.website || '' },
    }),
}

export { API_URL }

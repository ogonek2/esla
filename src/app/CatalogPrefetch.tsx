import { useEffect } from 'react'
import { api } from '@/shared/lib/api'
import { useLocale } from '@/shared/lib/locale'

/** Warm GET caches in the background for snappy SPA navigations. */
export function CatalogPrefetch() {
  const { locale } = useLocale()

  useEffect(() => {
    let cancelled = false
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const warm = async () => {
      try {
        await Promise.all([
          api.serviceCategories(locale),
          api.services(locale, { per_page: 100 }),
          api.services(locale, { featured: true, per_page: 20 }),
          api.doctors(locale),
          api.faq(locale),
          api.posts(locale, 6),
          api.reviews(locale),
        ])
      } catch {
        // prefetch is best-effort
      }
      void cancelled
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => void warm(), { timeout: 2500 })
    } else {
      timeoutId = setTimeout(() => void warm(), 400)
    }

    return () => {
      cancelled = true
      if (idleId != null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId != null) clearTimeout(timeoutId)
    }
  }, [locale])

  return null
}

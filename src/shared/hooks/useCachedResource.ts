import { useCallback, useEffect, useRef, useState } from 'react'
import { CACHE_TTL, cacheGet, cacheKey, cachePeek, cacheSet } from '@/shared/lib/cache'

type Options = {
  enabled?: boolean
  ttl?: number
  /** Soft refresh even when cache hit */
  revalidate?: boolean
}

type State<T> = {
  data: T | null
  loading: boolean
  refreshing: boolean
  error: boolean
}

export function useCachedResource<T>(
  keyParts: Array<string | number | boolean | null | undefined>,
  fetcher: () => Promise<T>,
  options: Options = {},
) {
  const { enabled = true, ttl = CACHE_TTL.default, revalidate = true } = options
  const key = cacheKey(keyParts)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const initial = enabled ? cachePeek<T>(key) : null
  const [state, setState] = useState<State<T>>({
    data: initial,
    loading: enabled && !initial,
    refreshing: false,
    error: false,
  })

  const load = useCallback(
    async (soft: boolean) => {
      if (!enabled) return
      const cached = cacheGet<T>(key)
      if (cached && soft) {
        setState((s) => ({ ...s, data: cached, loading: false, error: false }))
        if (!revalidate) return
        setState((s) => ({ ...s, refreshing: true }))
      } else if (!cached) {
        setState((s) => ({ ...s, loading: true, error: false }))
      }

      try {
        const data = await fetcherRef.current()
        cacheSet(key, data, ttl)
        setState({ data, loading: false, refreshing: false, error: false })
      } catch {
        setState((s) => ({
          data: s.data ?? cached ?? null,
          loading: false,
          refreshing: false,
          error: !s.data && !cached,
        }))
      }
    },
    [enabled, key, revalidate, ttl],
  )

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, refreshing: false, error: false })
      return
    }
    void load(true)
  }, [enabled, key, load])

  return {
    ...state,
    reload: () => load(false),
    cacheKey: key,
  }
}

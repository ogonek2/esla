import { getCookie, getLocalJson, setCookie, setLocalJson } from './storage'

type CacheEntry<T> = {
  v: 1
  data: T
  expires: number
}

const MEMORY = new Map<string, CacheEntry<unknown>>()
const LS_PREFIX = 'esla:cache:v2:'
const COOKIE_TS = 'esla_cache_ts'
const COOKIE_LOCALE = 'esla_locale'

export const CACHE_TTL = {
  short: 2 * 60 * 1000,
  default: 10 * 60 * 1000,
  long: 60 * 60 * 1000,
} as const

export function cacheKey(parts: Array<string | number | boolean | null | undefined>): string {
  return parts
    .filter((p) => p !== undefined && p !== null && p !== '')
    .map(String)
    .join(':')
}

export function cacheGet<T>(key: string): T | null {
  const mem = MEMORY.get(key) as CacheEntry<T> | undefined
  if (mem && mem.expires > Date.now()) return mem.data
  if (mem) MEMORY.delete(key)

  const stored = getLocalJson<CacheEntry<T>>(LS_PREFIX + key)
  if (!stored || stored.v !== 1) return null
  if (stored.expires <= Date.now()) return null

  MEMORY.set(key, stored)
  return stored.data
}

export function cacheSet<T>(key: string, data: T, ttlMs = CACHE_TTL.default): void {
  const entry: CacheEntry<T> = {
    v: 1,
    data,
    expires: Date.now() + ttlMs,
  }
  MEMORY.set(key, entry)
  setLocalJson(LS_PREFIX + key, entry)
  setCookie(COOKIE_TS, String(Date.now()), 7)
}

export function cachePeek<T>(key: string): T | null {
  const mem = MEMORY.get(key) as CacheEntry<T> | undefined
  if (mem) return mem.data
  const stored = getLocalJson<CacheEntry<T>>(LS_PREFIX + key)
  return stored?.v === 1 ? stored.data : null
}

export function persistLocaleCookie(locale: string): void {
  setCookie(COOKIE_LOCALE, locale, 180)
}

export function readLocaleCookie(): string | null {
  return getCookie(COOKIE_LOCALE)
}

export function readCacheTimestamp(): number | null {
  const raw = getCookie(COOKIE_TS)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

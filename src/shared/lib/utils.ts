import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined, locale = 'uk'): string | null {
  if (price == null) return null
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'uk-UA').format(price) + ' грн'
}

export function formatPriceFrom(price: number | null | undefined, locale = 'uk', label?: string | null): string {
  if (label) return label
  const formatted = formatPrice(price, locale)
  if (!formatted) return ''
  return locale === 'en' ? `from ${formatted}` : `від ${formatted}`
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return `tel:${digits}`
}

export function primaryPhone(phones: string[] | undefined, fallback: string): string {
  return phones?.[0] || fallback
}

export function getUtmParams(search: string): Record<string, string> {
  const params = new URLSearchParams(search)
  const utm: Record<string, string> = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const value = params.get(key)
    if (value) utm[key] = value
  }
  return utm
}

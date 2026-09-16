import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/shared/config/locales'
import { persistLocaleCookie } from '@/shared/lib/cache'

export function useLocale(): { locale: Locale } {
  const location = useLocation()
  const { i18n } = useTranslation()

  const locale = useMemo<Locale>(() => {
    const first = location.pathname.split('/').filter(Boolean)[0]
    if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
      return first
    }
    return DEFAULT_LOCALE
  }, [location.pathname])

  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale)
    }
    document.documentElement.lang = locale
    persistLocaleCookie(locale)
  }, [locale, i18n])

  return { locale }
}

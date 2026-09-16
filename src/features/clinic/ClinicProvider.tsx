import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/shared/lib/api'
import { CACHE_TTL, cachePeek, cacheSet, cacheKey } from '@/shared/lib/cache'
import type { Clinic } from '@/shared/lib/types'
import { primaryPhone, telHref } from '@/shared/lib/utils'
import { useLocale } from '@/shared/lib/locale'
import { setCookie } from '@/shared/lib/storage'

type ClinicContextValue = {
  clinic: Clinic | null
  loading: boolean
  error: boolean
  phone: string
  phoneHref: string
  refresh: () => Promise<void>
}

const ClinicContext = createContext<ClinicContextValue | null>(null)

const FALLBACK_PHONE =
  (import.meta.env.VITE_PHONE_FALLBACK as string | undefined) || '+380991370582'

export function ClinicProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale()
  const key = cacheKey(['clinic', locale])
  const [clinic, setClinic] = useState<Clinic | null>(() => cachePeek<Clinic>(key))
  const [loading, setLoading] = useState(() => !cachePeek<Clinic>(key))
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    const cached = cachePeek<Clinic>(key)
    if (!cached) setLoading(true)
    setError(false)
    try {
      const data = await api.clinic(locale)
      cacheSet(key, data, CACHE_TTL.long)
      setClinic(data)
      const phone = primaryPhone(data.phones, FALLBACK_PHONE)
      setCookie('esla_phone', phone, 7)
    } catch {
      if (!cached) {
        setClinic(null)
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }, [locale, key])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const phone = primaryPhone(clinic?.phones, FALLBACK_PHONE)
  const value = useMemo(
    () => ({
      clinic,
      loading,
      error,
      phone,
      phoneHref: telHref(phone),
      refresh,
    }),
    [clinic, loading, error, phone, refresh],
  )

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
}

export function useClinic() {
  const ctx = useContext(ClinicContext)
  if (!ctx) throw new Error('useClinic must be used within ClinicProvider')
  return ctx
}

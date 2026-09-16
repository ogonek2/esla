import { Link, useLocation } from 'react-router-dom'
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '@/shared/config/locales'
import { localizedPath } from '@/shared/config/routes'

function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] && isLocale(parts[0]) && parts[0] !== DEFAULT_LOCALE) {
    const rest = parts.slice(1).join('/')
    return rest ? `/${rest}` : '/'
  }
  return pathname || '/'
}

export function LanguageSwitcher() {
  const location = useLocation()
  const first = location.pathname.split('/').filter(Boolean)[0]
  const current: Locale =
    first && isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE
  const basePath = stripLocalePrefix(location.pathname)

  return (
    <div className="flex items-center gap-1 text-[12px] border border-[#e2e1de] rounded-sm">
      {LOCALES.map((l) => {
        const label = l === 'uk' ? 'UA' : l.toUpperCase()
        const to = localizedPath(l, basePath) + location.search
        return (
          <Link
            key={l}
            to={to}
            className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider transition-colors ${
              current === l ? 'bg-[#111110] text-white' : 'text-[#6b6b68] hover:text-[#111110]'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}

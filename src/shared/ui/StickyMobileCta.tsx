import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'

export function StickyMobileCta() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phoneHref } = useClinic()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#e2e1de] flex">
      <a
        href={phoneHref}
        className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#111110] text-white text-[13px] font-bold tracking-wide"
      >
        {t('sticky.call')}
      </a>
      <Link
        to={localizedPath(locale, routes.booking)}
        className="flex-1 flex items-center justify-center py-4 bg-[#c8a97e] text-[#111110] text-[13px] font-bold tracking-wide"
      >
        {t('sticky.book')}
      </Link>
    </div>
  )
}

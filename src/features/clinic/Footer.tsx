import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'
import { Container } from '@/shared/ui/layout'

export function Footer() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phone, phoneHref } = useClinic()
  const lp = (path: string) => localizedPath(locale, path)
  const year = new Date().getFullYear()

  const columns = [
    {
      title: t('nav.services'),
      items: [
        { label: t('nav.services'), to: lp(routes.services) },
        { label: t('nav.prices'), to: lp(routes.prices) },
        { label: t('nav.endolift'), to: lp(routes.endolift) },
        { label: t('nav.doctors'), to: lp(routes.doctors) },
      ],
    },
    {
      title: t('nav.about'),
      items: [
        { label: t('nav.about'), to: lp(routes.page('about')) },
        { label: t('nav.portfolio'), to: lp(routes.portfolio) },
        { label: t('nav.reviews'), to: lp(routes.reviews) },
        { label: t('nav.blog'), to: lp(routes.blog) },
        { label: t('nav.faq'), to: lp(routes.faq) },
      ],
    },
    {
      title: t('footer.legal'),
      items: [
        { label: t('footer.privacy'), to: lp(routes.page('privacy')) },
        { label: t('footer.cookies'), to: lp(routes.page('cookies')) },
        { label: t('footer.terms'), to: lp(routes.page('terms')) },
      ],
    },
  ]

  return (
    <footer className="bg-[#0d0d0c] text-white py-16 pb-24 lg:pb-16">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <span className="text-xl tracking-[0.25em] font-semibold font-display block mb-3">
              {t('brand')}
            </span>
            <p className="text-[13px] text-white/40 leading-relaxed mb-4">{t('footer.blurb')}</p>
            <a
              href={phoneHref}
              className="text-[14px] font-semibold hover:text-[#c8a97e] transition-colors"
            >
              {phone}
            </a>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] tracking-widest uppercase text-white/30 mb-4 font-semibold">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.to + item.label}>
                    <Link
                      to={item.to}
                      className="text-[13px] text-white/60 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/30">{t('footer.copyright', { year })}</p>
          <LanguageSwitcher />
        </div>
      </Container>
    </footer>
  )
}

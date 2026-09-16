import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Container, Section } from '@/shared/ui/layout'
import { Parallax, Reveal } from '@/shared/ui/motion'
import { ServiceArt } from '@/features/services/ServiceArt'

export function FinalCta() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phone, phoneHref } = useClinic()

  return (
    <Section tone="accent" compact className="!overflow-hidden">
      <Parallax
        speed={0.3}
        className="pointer-events-none absolute -left-[5%] top-0 w-[min(40vw,28rem)] opacity-25"
      >
        <ServiceArt variant={0} tone="ink" />
      </Parallax>
      <Parallax
        speed={-0.25}
        className="pointer-events-none absolute -right-[4%] bottom-0 w-[min(36vw,24rem)] opacity-20"
      >
        <ServiceArt variant={3} tone="ink" />
      </Parallax>

      <Container className="relative z-10 text-center">
        <Reveal>
          <h2 className="text-display font-normal font-display text-[#111110] mb-5 max-w-5xl mx-auto">
            {t('cta.title')}
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-lead text-[#111110]/70 mb-10 max-w-5xl mx-auto">{t('cta.subtitle')}</p>
        </Reveal>
        <Reveal delay={180}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={localizedPath(locale, routes.booking)}
              className="inline-flex items-center justify-center bg-[#111110] text-white px-10 py-5 text-[14px] md:text-[15px] font-bold tracking-wide uppercase hover:bg-[#333] transition-all duration-300 hover:scale-[1.02]"
            >
              {t('cta.book')}
            </Link>
            <a
              href={phoneHref}
              className="inline-flex items-center justify-center gap-2 border-2 border-[#111110] text-[#111110] px-10 py-5 text-[14px] md:text-[15px] font-bold tracking-wide uppercase hover:bg-[#111110] hover:text-white transition-all duration-300"
            >
              {phone}
            </a>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

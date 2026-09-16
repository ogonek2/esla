import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath, routes } from '@/shared/config/routes'
import { Container } from '@/shared/ui/layout'
import { Parallax, Reveal } from '@/shared/ui/motion'
import { ServiceArt } from '@/features/services/ServiceArt'

export function HeroSection() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phone, phoneHref } = useClinic()

  return (
    <section className="relative min-h-[100svh] bg-[#111110] text-white flex items-end overflow-hidden -mt-20 pt-20">
      {/* Unrestricted visual plane */}
      <Parallax speed={0.45} className="absolute inset-[-12%] scale-110">
        <div
          className="absolute inset-0 bg-cover bg-center ken-burns"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1761718209708-9ab9ba1c7252?w=2400&h=1600&fit=crop&auto=format)',
          }}
        />
      </Parallax>

      <div className="absolute inset-0 bg-gradient-to-r from-[#111110] via-[#111110]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111110] via-[#111110]/25 to-[#111110]/30" />

      {/* Floating art — no grid limit */}
      <Parallax
        speed={-0.35}
        className="pointer-events-none absolute -right-[8%] top-[18%] w-[min(42vw,34rem)] opacity-50 hidden lg:block float-slow"
      >
        <ServiceArt variant={0} tone="gold" />
      </Parallax>
      <Parallax
        speed={0.55}
        className="pointer-events-none absolute -left-[6%] bottom-[8%] w-[min(28vw,22rem)] opacity-25 hidden xl:block float-slower"
      >
        <ServiceArt variant={3} tone="soft" />
      </Parallax>

      <Container className="relative z-10 pb-20 lg:pb-28 pt-32 w-full">
        <div className="max-w-5xl">
          <Reveal delay={80}>
            <p className="text-[12px] md:text-[13px] tracking-[0.4em] uppercase text-[#c8a97e] font-semibold mb-7">
              {t('hero.eyebrow')}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <h1 className="text-hero font-normal font-display mb-8">
              {t('hero.title_line1')}
              <br />
              <em className="gold-shimmer">{t('hero.title_line2')}</em>
              <br />
              {t('hero.title_line3')}
            </h1>
          </Reveal>
          <Reveal delay={280}>
            <p className="text-lead text-white/70 mb-12 max-w-2xl font-light">
              {t('hero.subtitle')}
            </p>
          </Reveal>
          <Reveal delay={380}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={localizedPath(locale, routes.booking)}
                className="inline-flex items-center justify-center gap-2 bg-[#c8a97e] text-[#111110] px-10 py-5 text-[14px] md:text-[15px] font-bold tracking-wide uppercase hover:bg-[#b8966b] transition-all duration-300 hover:scale-[1.02]"
              >
                {t('hero.cta_book')}
              </Link>
              <a
                href={phoneHref}
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-10 py-5 text-[14px] md:text-[15px] font-semibold tracking-wide uppercase hover:bg-white/10 hover:border-[#c8a97e] transition-all duration-300"
              >
                {phone}
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

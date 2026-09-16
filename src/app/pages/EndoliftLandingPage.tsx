import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Seo } from '@/features/seo/Seo'
import { useLocale } from '@/shared/lib/locale'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { localizedPath, routes } from '@/shared/config/routes'
import { Container } from '@/shared/ui/layout'
import { GoldRule } from '@/features/services/ServiceArt'
import { getCategoryVisual } from '@/features/services/categoryVisuals'
import { Parallax, Reveal } from '@/shared/ui/motion'

const VISUAL = getCategoryVisual('endolift')

const PILLARS = ['regen', 'turgor', 'fat'] as const
const HIGHLIGHTS = ['session', 'skin', 'recovery', 'result'] as const
const MODES = ['lift', 'lipolysis'] as const
const BENEFITS = [
  'ambulatory',
  'anesthesia',
  'safe',
  'lasting',
  'one_session',
  'fiber',
  'downtime',
  'combine',
] as const
const AREAS = [
  'lipolysis',
  'endolifting',
  'laser_lipo',
  'fractional',
  'vascular',
  'therapy',
  'photobio',
  'general',
] as const
const ZONES = [
  'lower_lid',
  'jawline',
  'midface',
  'chin',
  'neck',
  'arms',
  'abdomen',
  'flanks',
  'thighs',
  'knees',
  'buttocks',
  'ankles',
] as const
const SPECS = [
  'wavelength',
  'programs',
  'pulse',
  'pulses',
  'interval',
  'mode',
  'cooling',
  'aim',
  'power',
  'compliance',
  'size',
  'origin',
] as const

export function EndoliftLandingPage() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { phone, phoneHref } = useClinic()

  return (
    <div className="bg-[#f7f4ef] min-h-[calc(100vh-4rem)]">
      <Seo title={t('endoliftPage.seo_title')} description={t('endoliftPage.seo_description')} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#111110] text-white -mt-20 pt-20 min-h-[min(88svh,52rem)]">
        <Parallax speed={0.4} className="absolute inset-[-12%]">
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center ken-burns"
            style={{ backgroundImage: `url(${VISUAL.image})` }}
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-[#111110] via-[#111110]/88 to-[#111110]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111110] via-transparent to-[#111110]/45" />

        <Container className="relative z-10 py-20 lg:py-28 xl:py-32 flex flex-col justify-end min-h-[min(72svh,44rem)]">
          <Reveal>
            <p className="text-[12px] tracking-[0.4em] uppercase text-[#c8a97e] font-semibold mb-6">
              {t('endoliftPage.eyebrow')}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <GoldRule className="mb-8 w-16" />
          </Reveal>
          <Reveal delay={140}>
            <p className="font-display text-[13px] tracking-[0.35em] uppercase text-white/50 mb-4">
              ENDOLIFT®
            </p>
            <h1 className="text-hero font-display font-normal max-w-4xl mb-8">
              {t('endoliftPage.hero_title')}
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="text-lead text-white/55 max-w-2xl mb-10">{t('endoliftPage.hero_text')}</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex flex-wrap gap-4">
              <Link
                to={localizedPath(locale, routes.booking)}
                className="inline-flex bg-[#c8a97e] text-[#111110] px-9 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#d4b896] transition-colors"
              >
                {t('endoliftPage.cta_consult')}
              </Link>
              <a
                href="#device"
                className="inline-flex border border-white/25 px-9 py-4 text-[13px] font-bold uppercase tracking-wide hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
              >
                {t('endoliftPage.cta_device')}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Highlights */}
      <section className="border-b border-[#111110]/08 bg-[#faf7f2]">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 lg:py-14">
            {HIGHLIGHTS.map((key, i) => (
              <Reveal key={key} delay={i * 60}>
                <p className="text-[11px] tracking-[0.28em] uppercase text-[#c8a97e] font-semibold mb-3">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-[16px] md:text-[17px] leading-snug text-[#111110]">
                  {t(`endoliftPage.highlights.${key}`)}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pillars */}
      <section className="py-20 lg:py-28">
        <Container>
          <Reveal>
            <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
              {t('endoliftPage.pillars_eyebrow')}
            </p>
            <h2 className="text-display font-display mb-14 max-w-3xl">{t('endoliftPage.pillars_title')}</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
            {PILLARS.map((key, i) => (
              <Reveal key={key} delay={i * 80}>
                <p className="font-mono text-[13px] text-[#c8a97e] mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-2xl md:text-3xl mb-4 leading-tight">
                  {t(`endoliftPage.pillars.${key}.title`)}
                </h3>
                <p className="text-[#6b6b68] leading-relaxed">{t(`endoliftPage.pillars.${key}.text`)}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Device */}
      <section id="device" className="py-20 lg:py-28 bg-[#111110] text-white">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <Reveal className="lg:col-span-5">
              <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
                {t('endoliftPage.device_eyebrow')}
              </p>
              <h2 className="text-display font-display mb-6">{t('endoliftPage.device_title')}</h2>
              <p className="text-white/55 leading-relaxed mb-8">{t('endoliftPage.device_text')}</p>
              <p className="text-[13px] text-white/35 leading-relaxed">{t('endoliftPage.device_note')}</p>
            </Reveal>
            <div className="lg:col-span-7 space-y-10">
              {MODES.map((key, i) => (
                <Reveal key={key} delay={i * 90}>
                  <div className="border-t border-white/10 pt-8">
                    <h3 className="font-display text-2xl mb-3 text-[#c8a97e]">
                      {t(`endoliftPage.modes.${key}.title`)}
                    </h3>
                    <p className="text-white/60 leading-relaxed max-w-2xl">
                      {t(`endoliftPage.modes.${key}.text`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Application areas */}
      <section className="py-20 lg:py-28">
        <Container>
          <Reveal>
            <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
              {t('endoliftPage.areas_eyebrow')}
            </p>
            <h2 className="text-display font-display mb-12 max-w-2xl">{t('endoliftPage.areas_title')}</h2>
          </Reveal>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e8e2d8] border border-[#e8e2d8]">
            {AREAS.map((key, i) => (
              <Reveal key={key} delay={Math.min(i * 40, 240)}>
                <li className="bg-[#f7f4ef] px-6 py-7 min-h-[7rem] flex items-end">
                  <span className="font-display text-lg leading-snug">{t(`endoliftPage.areas.${key}`)}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-28 bg-[#faf7f2]">
        <Container>
          <Reveal>
            <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
              {t('endoliftPage.benefits_eyebrow')}
            </p>
            <h2 className="text-display font-display mb-14">{t('endoliftPage.benefits_title')}</h2>
          </Reveal>
          <ol className="grid sm:grid-cols-2 gap-x-12 gap-y-0">
            {BENEFITS.map((key, i) => (
              <Reveal key={key} delay={Math.min(i * 40, 280)} as="li">
                <div className="grid grid-cols-[auto_1fr] gap-5 py-6 border-t border-[#111110]/10">
                  <span className="font-mono text-[12px] text-[#c8a97e] pt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[16px] md:text-[17px] leading-snug">{t(`endoliftPage.benefits.${key}`)}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Mechanism */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
                {t('endoliftPage.mechanism_eyebrow')}
              </p>
              <h2 className="text-display font-display leading-tight">
                {t('endoliftPage.mechanism_title')}
              </h2>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-7 lg:col-start-6 space-y-6">
              <p className="text-[17px] leading-[1.8] text-[#3a3834]">{t('endoliftPage.mechanism_p1')}</p>
              <p className="text-[17px] leading-[1.8] text-[#3a3834]">{t('endoliftPage.mechanism_p2')}</p>
              <p className="text-[15px] leading-relaxed text-[#6b6b68]">{t('endoliftPage.mechanism_p3')}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Specs */}
      <section className="py-20 lg:py-28 bg-[#111110] text-white">
        <Container>
          <Reveal>
            <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
              {t('endoliftPage.specs_eyebrow')}
            </p>
            <h2 className="text-display font-display mb-12">{t('endoliftPage.specs_title')}</h2>
          </Reveal>
          <dl className="border-t border-white/10">
            {SPECS.map((key, i) => (
              <Reveal key={key} delay={Math.min(i * 30, 200)}>
                <div className="grid sm:grid-cols-[minmax(12rem,18rem)_1fr] gap-3 sm:gap-8 py-5 border-b border-white/10">
                  <dt className="text-[12px] tracking-[0.16em] uppercase text-white/40">
                    {t(`endoliftPage.specs.${key}.label`)}
                  </dt>
                  <dd className="text-[15px] text-white/75 leading-relaxed">
                    {t(`endoliftPage.specs.${key}.value`)}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Zones */}
      <section className="py-20 lg:py-28">
        <Container>
          <Reveal>
            <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
              {t('endoliftPage.zones_eyebrow')}
            </p>
            <h2 className="text-display font-display mb-4 max-w-3xl">{t('endoliftPage.zones_title')}</h2>
            <p className="text-[#6b6b68] max-w-2xl mb-12 leading-relaxed">{t('endoliftPage.zones_text')}</p>
          </Reveal>
          <ul className="flex flex-wrap gap-3">
            {ZONES.map((key, i) => (
              <Reveal key={key} delay={Math.min(i * 25, 200)}>
                <li className="border border-[#111110]/15 px-5 py-3 text-[14px] tracking-wide">
                  {t(`endoliftPage.zones.${key}`)}
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-[#111110] text-white">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <Reveal className="lg:col-span-7">
              <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-5">
                {t('endoliftPage.cta_eyebrow')}
              </p>
              <h2 className="text-display font-display mb-5">{t('endoliftPage.cta_title')}</h2>
              <p className="text-white/55 max-w-xl leading-relaxed mb-4">{t('endoliftPage.cta_text')}</p>
              <p className="text-[13px] text-white/35 leading-relaxed max-w-xl">
                {t('endoliftPage.source_note')}{' '}
                <a
                  href="https://endolift.vlarus.info/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-[#c8a97e]/50 underline-offset-4 hover:text-[#c8a97e]"
                >
                  endolift.vlarus.info
                </a>
              </p>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end">
              <Link
                to={localizedPath(locale, routes.booking)}
                className="inline-flex justify-center bg-[#c8a97e] text-[#111110] px-9 py-4 text-[13px] font-bold uppercase tracking-wide hover:bg-[#d4b896] transition-colors"
              >
                {t('endoliftPage.cta_consult')}
              </Link>
              <Link
                to={localizedPath(locale, `${routes.services}?category=endolift`)}
                className="inline-flex justify-center border border-white/25 px-9 py-4 text-[13px] font-bold uppercase tracking-wide hover:border-[#c8a97e] hover:text-[#c8a97e] transition-colors"
              >
                {t('endoliftPage.cta_services')}
              </Link>
              <a
                href={phoneHref}
                className="inline-flex justify-center text-[13px] tracking-wide text-white/50 hover:text-[#c8a97e] transition-colors py-2"
              >
                {phone}
              </a>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  )
}

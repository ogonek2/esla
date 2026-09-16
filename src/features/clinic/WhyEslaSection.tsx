import { useTranslation } from 'react-i18next'
import { Container, Section } from '@/shared/ui/layout'
import { GoldRule } from '@/features/services/ServiceArt'

export function WhyEslaSection() {
  const { t } = useTranslation()
  const keys = ['01', '02', '03', '04'] as const

  return (
    <Section className="bg-[#faf7f2]">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-4">
              {t('why.eyebrow')}
            </p>
            <GoldRule className="mb-5" />
            <h2 className="text-4xl lg:text-5xl font-normal font-display leading-tight mb-6">
              {t('why.title')}
            </h2>
            <p className="text-[15px] text-[#6b6b68] leading-relaxed max-w-md">{t('why.subtitle')}</p>
          </div>
          <div className="lg:col-span-7 space-y-0 divide-y divide-[#e8e2d8] bg-white border border-[#e8e2d8] px-6 lg:px-8">
            {keys.map((num) => (
              <div key={num} className="py-7 flex gap-6 lg:gap-8">
                <span className="text-[11px] font-mono text-[#c8a97e] mt-1 flex-shrink-0 tracking-wider w-6">
                  {num}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#111110] mb-2">
                    {t(`why.items.${num}.title`)}
                  </h3>
                  <p className="text-[14px] text-[#6b6b68] leading-relaxed max-w-lg">
                    {t(`why.items.${num}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

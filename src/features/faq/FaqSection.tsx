import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FaqItem } from '@/shared/lib/types'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { Container, Section } from '@/shared/ui/layout'

export function FaqSection({ items }: { items: FaqItem[] }) {
  const { t } = useTranslation()
  const { phoneHref } = useClinic()
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  if (!items.length) return null

  return (
    <Section id="faq" tone="white">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-4">
              {t('faq.eyebrow')}
            </p>
            <h2 className="text-4xl lg:text-5xl font-normal font-display leading-tight mb-6">
              {t('faq.title')}
            </h2>
            <p className="text-[15px] text-[#6b6b68] leading-relaxed mb-8 max-w-md">
              {t('faq.subtitle')}
            </p>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 bg-[#111110] text-white px-6 py-3.5 text-[13px] font-bold tracking-wide uppercase hover:bg-[#333] transition-colors"
            >
              {t('faq.call')}
            </a>
          </div>
          <div className="lg:col-span-7 divide-y divide-[#e2e1de]">
            {items.map((faq, i) => (
              <div key={faq.id} className="py-5 first:pt-0">
                <button
                  type="button"
                  className="w-full flex items-start justify-between gap-4 text-left"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                >
                  <span className="text-[15px] font-semibold text-[#111110] leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 border border-[#e2e1de] flex items-center justify-center text-[18px] transition-transform duration-200 ${openIdx === i ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                {openIdx === i && faq.answer && (
                  <p className="mt-3 text-[14px] text-[#6b6b68] leading-relaxed pr-10">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

import { useTranslation } from 'react-i18next'
import { LeadForm } from '@/features/booking/LeadForm'
import { useClinic } from '@/features/clinic/ClinicProvider'
import type { Service } from '@/shared/lib/types'
import { Container, Section } from '@/shared/ui/layout'

export function BookingSection({ services }: { services: Service[] }) {
  const { t } = useTranslation()
  const { phone, phoneHref, clinic } = useClinic()

  return (
    <Section id="booking" tone="muted">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-4">
              {t('booking.eyebrow')}
            </p>
            <h2 className="text-4xl lg:text-5xl font-normal font-display leading-tight mb-6">
              {t('booking.title')}
            </h2>
            <p className="text-[15px] text-[#6b6b68] leading-relaxed mb-10 max-w-md">
              {t('booking.subtitle')}
            </p>
            <div className="space-y-5">
              <div>
                <p className="text-[11px] text-[#6b6b68] uppercase tracking-widest mb-1">
                  {t('booking.phone_label')}
                </p>
                <a
                  href={phoneHref}
                  className="text-[16px] font-semibold text-[#111110] hover:text-[#c8a97e] transition-colors"
                >
                  {phone}
                </a>
              </div>
              {clinic?.address && (
                <div>
                  <p className="text-[11px] text-[#6b6b68] uppercase tracking-widest mb-1">
                    {t('booking.address_label')}
                  </p>
                  <p className="text-[15px] font-semibold text-[#111110]">{clinic.address}</p>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-7 bg-white p-8 lg:p-10 border border-[#e2e1de]">
            <LeadForm type="booking" services={services} />
          </div>
        </div>
      </Container>
    </Section>
  )
}

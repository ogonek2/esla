import { useTranslation } from 'react-i18next'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { clinicPhones } from '@/features/clinic/clinicLinks'
import { SocialLinks } from '@/features/clinic/SocialLinks'
import { telHref } from '@/shared/lib/utils'
import { Container, Section } from '@/shared/ui/layout'

export function ContactsSection() {
  const { t } = useTranslation()
  const { clinic, phone, phoneHref } = useClinic()
  const phones = clinicPhones(clinic?.phones)
  const displayPhones = phones.length ? phones : phone ? [phone] : []

  return (
    <Section id="contacts" tone="dark">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#c8a97e] font-semibold mb-4">
              {t('contacts.eyebrow')}
            </p>
            <h2 className="text-3xl lg:text-4xl font-normal font-display mb-8">
              {t('contacts.title')}
            </h2>
            <div className="space-y-6">
              {displayPhones.length > 0 && (
                <div>
                  <p className="text-[11px] tracking-widest uppercase text-white/40 mb-1">
                    {t('contacts.phone')}
                  </p>
                  <div className="space-y-1">
                    {displayPhones.map((p) => (
                      <a
                        key={p}
                        href={telHref(p)}
                        className="block text-[18px] font-semibold hover:text-[#c8a97e] transition-colors"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {!displayPhones.length && phoneHref && (
                <div>
                  <p className="text-[11px] tracking-widest uppercase text-white/40 mb-1">
                    {t('contacts.phone')}
                  </p>
                  <a
                    href={phoneHref}
                    className="text-[18px] font-semibold hover:text-[#c8a97e] transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {clinic?.email && (
                <div>
                  <p className="text-[11px] tracking-widest uppercase text-white/40 mb-1">
                    {t('contacts.email')}
                  </p>
                  <a
                    href={`mailto:${clinic.email}`}
                    className="text-[15px] font-semibold hover:text-[#c8a97e] transition-colors"
                  >
                    {clinic.email}
                  </a>
                </div>
              )}
              {clinic?.address && (
                <div>
                  <p className="text-[11px] tracking-widest uppercase text-white/40 mb-1">
                    {t('contacts.address')}
                  </p>
                  <p className="text-[15px]">{clinic.address}</p>
                </div>
              )}
              {clinic?.schedule && (
                <div>
                  <p className="text-[11px] tracking-widest uppercase text-white/40 mb-1">
                    {t('contacts.schedule')}
                  </p>
                  <p className="text-[15px]">{clinic.schedule}</p>
                </div>
              )}
            </div>
            <SocialLinks tone="dark" includeMessengers className="mt-8" />
          </div>
          <div className="lg:col-span-8 bg-[#1a1a18] flex items-center justify-center min-h-72 overflow-hidden">
            {clinic?.map?.embed_url ? (
              <iframe
                title="map"
                src={clinic.map.embed_url}
                className="w-full h-full min-h-72 border-0"
                loading="lazy"
              />
            ) : (
              <p className="text-white/40 text-[13px] text-center px-6">
                {t('contacts.map_placeholder')}
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

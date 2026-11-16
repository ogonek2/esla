import { useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useClinic } from '@/features/clinic/ClinicProvider'
import { useLocale } from '@/shared/lib/locale'
import { api } from '@/shared/lib/api'
import { getUtmParams } from '@/shared/lib/utils'
import {
  mountCrmBookingWidget,
  type CrmBookingPayload,
} from '@/features/booking/crm/mountCrmBookingWidget'
import '@/features/booking/crm/crmBookingWidget.css'

const CRM_BASE =
  (import.meta.env.VITE_CRM_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://1cloud.in.ua/EslaSSE/hs/SiteServiceEntry'

function formatPhoneDisplay(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('380')) {
    return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}`
  }
  return phone
}

export function CrmBookingWidget() {
  const { locale } = useLocale()
  const { phone, clinic } = useClinic()
  const location = useLocation()
  const rootRef = useRef<HTMLDivElement>(null)
  const submittedRef = useRef<string | null>(null)

  const phones = useMemo(() => {
    const list = (clinic?.phones || []).map(formatPhoneDisplay).filter(Boolean)
    if (!list.length && phone) list.push(formatPhoneDisplay(phone))
    return list
  }, [clinic?.phones, phone])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const onBooking = (payload: CrmBookingPayload) => {
      const patient = payload.patient || {}
      const name = [patient.lastname, patient.firstname, patient.patronymic]
        .map((s) => (s || '').trim())
        .filter(Boolean)
        .join(' ')
      const phoneDigits = (patient.phone || '').replace(/\D/g, '')
      const stamp = `${phoneDigits}|${payload.time_slot || payload.time || ''}|${payload.service_id || ''}`
      if (!name || phoneDigits.length < 10) return
      if (submittedRef.current === stamp) return
      submittedRef.current = stamp

      const when = [payload.date, (payload.time_slot || payload.time || '').slice(11, 16)]
        .filter(Boolean)
        .join(' ')
      const comment = [
        'CRM-запис (1С)',
        payload.service_name ? `Послуга: ${payload.service_name}` : null,
        payload.resource_name ? `Лікар: ${payload.resource_name}` : null,
        when ? `Час: ${when}` : null,
      ]
        .filter(Boolean)
        .join('\n')

      void api
        .lead(
          'booking',
          {
            name,
            phone: phoneDigits.startsWith('380') ? `+${phoneDigits}` : phoneDigits,
            comment,
            consent: true,
            website: '',
            page_url: window.location.href,
            locale,
            ...getUtmParams(location.search),
          },
          locale,
        )
        .catch(() => {
          submittedRef.current = null
        })
    }

    const destroy = mountCrmBookingWidget(
      el,
      {
        baseUrl: CRM_BASE,
        clinicName: 'ESLA',
        clinicPhones: phones,
        dryRun: true,
      },
      onBooking,
    )

    return () => {
      destroy()
    }
  }, [phones, locale, location.search])

  return <div ref={rootRef} className="crm-booking-widget w-full" />
}

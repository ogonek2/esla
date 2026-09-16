import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { api, ApiError } from '@/shared/lib/api'
import type { Service } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { getUtmParams } from '@/shared/lib/utils'

const schema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(9).max(32),
  service_slug: z.string().optional(),
  comment: z.string().max(2000).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
})

type FormValues = z.infer<typeof schema>

type LeadFormProps = {
  type?: 'consultation' | 'booking' | 'feedback'
  services?: Service[]
  defaultServiceSlug?: string
  compact?: boolean
  variant?: 'light' | 'dark'
}

export function LeadForm({
  type = 'booking',
  services = [],
  defaultServiceSlug,
  compact = false,
  variant = 'light',
}: LeadFormProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const location = useLocation()
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const dark = variant === 'dark'

  const labelCls = dark
    ? 'block text-[11px] font-semibold tracking-widest uppercase text-white/55 mb-2'
    : 'block text-[11px] font-semibold tracking-widest uppercase text-[#6b6b68] mb-2'
  const fieldCls = dark
    ? 'w-full border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#c8a97e] transition-colors'
    : 'w-full border border-[#e2e1de] px-4 py-3 text-[14px] focus:outline-none focus:border-[#111110] transition-colors bg-transparent'
  const mutedCls = dark ? 'text-white/55' : 'text-[#6b6b68]'
  const submitCls = dark
    ? 'w-full bg-[#c8a97e] text-[#111110] py-4 text-[14px] font-bold tracking-wide uppercase hover:bg-[#b8966b] transition-colors duration-200 disabled:opacity-60'
    : 'w-full bg-[#111110] text-white py-4 text-[14px] font-bold tracking-wide uppercase hover:bg-[#333] transition-colors duration-200 disabled:opacity-60'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      service_slug: defaultServiceSlug || '',
      comment: '',
      website: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    try {
      await api.lead(
        type,
        {
          name: values.name,
          phone: values.phone,
          service_slug: values.service_slug || undefined,
          comment: values.comment,
          consent: true,
          website: '',
          page_url: window.location.href,
          locale,
          ...getUtmParams(location.search),
        },
        locale,
      )
      setDone(true)
    } catch (e) {
      if (e instanceof ApiError && e.errors?.phone?.[0]) {
        setServerError(e.errors.phone[0])
      } else {
        setServerError(t('booking.error'))
      }
    }
  })

  if (done) {
    return (
      <div className={`text-center ${compact ? 'py-6' : 'py-12'}`}>
        <div
          className={`w-16 h-16 flex items-center justify-center mx-auto mb-6 ${dark ? 'bg-[#c8a97e]' : 'bg-[#111110]'}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={dark ? '#111110' : 'white'}
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3
          className={`text-[22px] font-semibold font-display mb-3 ${dark ? 'text-white' : ''}`}
        >
          {t('booking.success_title')}
        </h3>
        <p className={`text-[14px] leading-relaxed ${mutedCls}`}>{t('booking.success_text')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} />

      <div>
        <label className={labelCls}>{t('booking.name')}</label>
        <input type="text" className={fieldCls} {...register('name')} />
        {errors.name && <p className="text-[12px] text-red-400 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelCls}>{t('booking.phone')}</label>
        <input
          type="tel"
          placeholder="+380XXXXXXXXX"
          className={fieldCls}
          {...register('phone')}
        />
        {errors.phone && <p className="text-[12px] text-red-400 mt-1">{errors.phone.message}</p>}
      </div>

      {services.length > 0 && (
        <div>
          <label className={labelCls}>{t('booking.service')}</label>
          <select
            className={`${fieldCls} ${dark ? '' : 'text-[#111110]'}`}
            {...register('service_slug')}
          >
            <option value="">{t('booking.service_placeholder')}</option>
            {services.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelCls}>{t('booking.comment')}</label>
        <textarea rows={3} className={`${fieldCls} resize-none`} {...register('comment')} />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="mt-0.5 flex-shrink-0" {...register('consent')} />
        <span className={`text-[12px] leading-relaxed ${mutedCls}`}>{t('booking.consent')}</span>
      </label>
      {errors.consent && <p className="text-[12px] text-red-400">{t('booking.consent')}</p>}

      {serverError && <p className="text-[13px] text-red-400">{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className={submitCls}>
        {t('booking.submit')}
      </button>
    </form>
  )
}

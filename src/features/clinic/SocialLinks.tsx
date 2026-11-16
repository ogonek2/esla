import { useClinic } from '@/features/clinic/ClinicProvider'
import { externalHref } from '@/features/clinic/clinicLinks'
import type { SocialLink } from '@/shared/lib/types'
import { cn } from '@/shared/lib/utils'

function guessIcon(label: string): string {
  const key = label.toLowerCase()
  if (key.includes('instagram')) return 'fa-brands fa-instagram'
  if (key.includes('facebook') || key === 'fb') return 'fa-brands fa-facebook-f'
  if (key.includes('telegram') || key === 'tg') return 'fa-brands fa-telegram'
  if (key.includes('whatsapp') || key === 'wa') return 'fa-brands fa-whatsapp'
  if (key.includes('viber')) return 'fa-brands fa-viber'
  if (key.includes('youtube') || key === 'yt') return 'fa-brands fa-youtube'
  if (key.includes('tiktok')) return 'fa-brands fa-tiktok'
  if (key.includes('twitter') || key === 'x') return 'fa-brands fa-x-twitter'
  if (key.includes('linkedin')) return 'fa-brands fa-linkedin-in'
  if (key.includes('threads')) return 'fa-brands fa-threads'
  if (key.includes('mail') || key.includes('email')) return 'fa-solid fa-envelope'
  if (key.includes('phone') || key.includes('tel')) return 'fa-solid fa-phone'
  return 'fa-solid fa-globe'
}

/** Normalize API social (items or legacy map) + optional messengers into icon links. */
export function useSocialItems(includeMessengers = false): SocialLink[] {
  const { clinic } = useClinic()
  const social = clinic?.social
  const items: SocialLink[] = []

  if (Array.isArray(social)) {
    for (const row of social) {
      if (!row?.url) continue
      items.push({
        label: row.label || 'Social',
        url: row.url,
        icon: row.icon || guessIcon(row.label || ''),
      })
    }
  } else if (social && typeof social === 'object') {
    for (const [label, url] of Object.entries(social)) {
      if (!url) continue
      items.push({ label, url, icon: guessIcon(label) })
    }
  }

  if (includeMessengers && clinic?.messengers) {
    for (const [label, url] of Object.entries(clinic.messengers)) {
      if (!url?.trim()) continue
      if (items.some((i) => i.url === url || i.label.toLowerCase() === label.toLowerCase())) continue
      items.push({ label, url, icon: guessIcon(label) })
    }
  }

  return items
}

type Tone = 'light' | 'dark' | 'gold'

const TONE: Record<Tone, string> = {
  light:
    'border-[#e2e1de] text-[#111110]/70 hover:border-[#c8a97e] hover:text-[#c8a97e] bg-white/80',
  dark: 'border-white/20 text-white/75 hover:border-[#c8a97e] hover:text-[#c8a97e]',
  gold: 'border-[#c8a97e]/45 text-[#c8a97e] hover:bg-[#c8a97e]/15 hover:border-[#c8a97e]',
}

export function SocialLinks({
  className,
  tone = 'dark',
  size = 'md',
  includeMessengers = false,
  label,
}: {
  className?: string
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  includeMessengers?: boolean
  label?: string
}) {
  const items = useSocialItems(includeMessengers)
  if (!items.length) return null

  const box =
    size === 'sm' ? 'h-9 w-9 text-[14px]' : size === 'lg' ? 'h-11 w-11 text-[18px]' : 'h-10 w-10 text-[16px]'

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label ? (
        <p className="text-[10px] tracking-[0.28em] uppercase text-current/45 font-semibold">
          {label}
        </p>
      ) : null}
      <ul className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <li key={`${item.label}-${item.url}`}>
            <a
              href={externalHref(item.url)}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              title={item.label}
              className={cn(
                'inline-flex items-center justify-center border transition-colors',
                box,
                TONE[tone],
              )}
            >
              <i className={item.icon} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

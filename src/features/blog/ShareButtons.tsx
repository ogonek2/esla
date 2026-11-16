import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'

type ShareButtonsProps = {
  title: string
  url?: string
  className?: string
  tone?: 'light' | 'dark'
}

export function ShareButtons({ title, url, className, tone = 'light' }: ShareButtonsProps) {
  const { t } = useTranslation()
  const shareUrl = useMemo(() => {
    if (url) return url
    if (typeof window !== 'undefined') return window.location.href
    return ''
  }, [url])

  if (!shareUrl) return null

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    {
      label: 'Facebook',
      icon: 'fa-brands fa-facebook-f',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'Telegram',
      icon: 'fa-brands fa-telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: 'X',
      icon: 'fa-brands fa-x-twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: 'LinkedIn',
      icon: 'fa-brands fa-linkedin-in',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'WhatsApp',
      icon: 'fa-brands fa-whatsapp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
  ]

  const box =
    tone === 'dark'
      ? 'border-white/20 text-white/75 hover:border-[#c8a97e] hover:text-[#c8a97e]'
      : 'border-[#e2e1de] text-[#111110]/70 hover:border-[#c8a97e] hover:text-[#c8a97e] bg-white'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#c8a97e] font-semibold">
        {t('blog.share')}
      </p>
      <ul className="flex flex-wrap items-center gap-2">
        {links.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              title={item.label}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center border transition-colors text-[15px]',
                box,
              )}
            >
              <i className={item.icon} aria-hidden />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => void copy()}
            aria-label={t('blog.copy_link')}
            title={t('blog.copy_link')}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center border transition-colors text-[15px]',
              box,
            )}
          >
            <i className="fa-solid fa-link" aria-hidden />
          </button>
        </li>
      </ul>
    </div>
  )
}

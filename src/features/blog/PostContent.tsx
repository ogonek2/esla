import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ContentBlock } from '@/shared/lib/types'
import { useLocale } from '@/shared/lib/locale'
import { localizedPath } from '@/shared/config/routes'
import { cn } from '@/shared/lib/utils'
import { RichHtml } from '@/shared/ui/RichHtml'

/** Reading column for text modules — images can break out of this. */
const PROSE = 'post-module--prose mx-auto w-full max-w-5xl'

function resolveInternalHref(url: string, locale: string): string {
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:')
  ) {
    return url
  }
  const path = url.startsWith('/') ? url : `/${url}`
  return localizedPath(locale as 'uk' | 'en' | 'ru', path)
}

export function PostContent({ blocks }: { blocks?: ContentBlock[] | null }) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  if (!blocks?.length) {
    return (
      <p className="text-[#6b6b68] py-8">
        {t('blog.empty_body', { defaultValue: 'Контент зʼявиться незабаром.' })}
      </p>
    )
  }

  return (
    <div className="post-modules space-y-10 md:space-y-12">
      {blocks.map((block, index) => (
        <PostModule key={`${block.type}-${index}`} block={block} locale={locale} />
      ))}
    </div>
  )
}

function PostModule({
  block,
  locale,
}: {
  block: ContentBlock
  locale: string
}) {
  const data = block.data || {}

  switch (block.type) {
    case 'heading': {
      const Tag = (data.level === 'h3' || data.level === 'h4' ? data.level : 'h2') as
        | 'h2'
        | 'h3'
        | 'h4'
      return (
        <div className={PROSE}>
          <Tag
            className={cn(
              'font-display text-[#111110] leading-tight',
              Tag === 'h2' && 'text-3xl md:text-4xl',
              Tag === 'h3' && 'text-2xl md:text-3xl',
              Tag === 'h4' && 'text-xl md:text-2xl',
            )}
          >
            {String(data.text || '')}
          </Tag>
        </div>
      )
    }

    case 'text':
      return data.html ? (
        <div className={PROSE}>
          <RichHtml html={String(data.html)} />
        </div>
      ) : null

    case 'image':
      return data.url ? (
        <figure
          className={cn(
            'post-module-image mx-auto w-full',
            // Explicit widths — parent page must NOT be max-w-5xl or these never show.
            data.width === 'full' && 'post-module-image--full',
            data.width === 'wide' && 'post-module-image--wide',
            (!data.width || data.width === 'content') && 'post-module-image--content',
          )}
        >
          <img
            src={String(data.url)}
            alt={String(data.alt || data.caption || '')}
            className="w-full object-cover"
            loading="lazy"
          />
          {data.caption ? (
            <figcaption className="mt-3 text-sm text-[#9a958c] text-center px-4">
              {String(data.caption)}
            </figcaption>
          ) : null}
        </figure>
      ) : null

    case 'gallery': {
      const urls = Array.isArray(data.urls) ? data.urls.map(String) : []
      if (!urls.length) return null
      return (
        <figure className="post-module-image post-module-image--wide mx-auto w-full">
          <div
            className={cn(
              'grid gap-3',
              urls.length === 1 && 'grid-cols-1',
              urls.length === 2 && 'grid-cols-2',
              urls.length >= 3 && 'grid-cols-2 md:grid-cols-3',
            )}
          >
            {urls.map((url) => (
              <img
                key={url}
                src={url}
                alt=""
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            ))}
          </div>
          {data.caption ? (
            <figcaption className="mt-3 text-sm text-[#9a958c] text-center px-4">
              {String(data.caption)}
            </figcaption>
          ) : null}
        </figure>
      )
    }

    case 'quote':
      return (
        <div className={PROSE}>
          <blockquote className="border-l-2 border-[#c8a97e] pl-6 md:pl-8 py-1">
            <p className="font-display text-xl md:text-2xl text-[#111110] leading-relaxed">
              {String(data.text || '')}
            </p>
            {data.author ? (
              <cite className="mt-4 block text-sm not-italic tracking-wide uppercase text-[#9a958c]">
                — {String(data.author)}
              </cite>
            ) : null}
          </blockquote>
        </div>
      )

    case 'list': {
      const items = Array.isArray(data.items) ? data.items.map(String) : []
      if (!items.length) return null
      const ListTag = data.style === 'numbered' ? 'ol' : 'ul'
      return (
        <div className={PROSE}>
          <ListTag
            className={cn(
              'space-y-3 text-[16px] text-[#3a3834] leading-relaxed pl-5',
              data.style === 'numbered' ? 'list-decimal' : 'list-disc',
            )}
          >
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ListTag>
        </div>
      )
    }

    case 'callout': {
      const tone = String(data.tone || 'gold')
      return (
        <div className={PROSE}>
          <aside
            className={cn(
              'px-6 py-7 md:px-8 md:py-8',
              tone === 'dark' && 'bg-[#111110] text-white',
              tone === 'soft' && 'bg-[#f0ebe3] text-[#111110]',
              tone === 'gold' && 'bg-[#111110] text-white border-l-4 border-[#c8a97e]',
            )}
          >
            {data.title ? (
              <p className="text-[12px] tracking-[0.28em] uppercase font-semibold mb-3 text-[#c8a97e]">
                {String(data.title)}
              </p>
            ) : null}
            <p
              className={cn(
                'leading-relaxed text-[15px]',
                tone === 'soft' ? 'text-[#3a3834]' : 'text-white/75',
              )}
            >
              {String(data.text || '')}
            </p>
          </aside>
        </div>
      )
    }

    case 'cta': {
      const href = resolveInternalHref(String(data.button_url || '/booking'), locale)
      const external = href.startsWith('http')
      const dark = data.dark !== false
      const className = cn(
        'inline-flex px-8 py-4 text-[13px] font-bold uppercase tracking-wide transition-colors',
        dark
          ? 'bg-[#c8a97e] text-[#111110] hover:bg-[#d4b896]'
          : 'bg-[#111110] text-white hover:bg-[#333]',
      )
      return (
        <div className={cn(PROSE, dark ? 'bg-[#111110] text-white' : 'bg-[#f0ebe3]', 'px-6 py-10 md:px-10 md:py-12')}>
          {data.title ? (
            <h3 className="font-display text-2xl md:text-3xl mb-3">{String(data.title)}</h3>
          ) : null}
          {data.text ? (
            <p className={cn('mb-7 max-w-xl leading-relaxed', dark ? 'text-white/60' : 'text-[#6b6b68]')}>
              {String(data.text)}
            </p>
          ) : null}
          {external ? (
            <a href={href} className={className} target="_blank" rel="noreferrer">
              {String(data.button_label || 'CTA')}
            </a>
          ) : (
            <Link to={href} className={className}>
              {String(data.button_label || 'CTA')}
            </Link>
          )}
        </div>
      )
    }

    case 'divider': {
      const style = String(data.style || 'line')
      if (style === 'space') return <div className="h-6 md:h-10" aria-hidden />
      if (style === 'gold') {
        return (
          <div className={PROSE}>
            <div className="h-px w-16 bg-[#c8a97e]" aria-hidden />
          </div>
        )
      }
      return (
        <div className={PROSE}>
          <hr className="border-0 border-t border-[#e8e2d8]" />
        </div>
      )
    }

    case 'embed': {
      const embed = data.embed_url ? String(data.embed_url) : null
      const html = data.html ? String(data.html) : null
      return (
        <figure className="post-module-image post-module-image--wide mx-auto w-full">
          {embed ? (
            <div className="relative aspect-video bg-[#161412] overflow-hidden">
              <iframe
                src={embed}
                title={String(data.caption || 'Video')}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : html ? (
            <div className="post-embed overflow-hidden" dangerouslySetInnerHTML={{ __html: html }} />
          ) : null}
          {data.caption ? (
            <figcaption className="mt-3 text-sm text-[#9a958c] text-center px-4">
              {String(data.caption)}
            </figcaption>
          ) : null}
        </figure>
      )
    }

    default:
      return null
  }
}

import { cn } from '@/shared/lib/utils'

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

/** Renders CMS rich HTML, or plain text with line breaks for legacy content. */
export function RichHtml({
  html,
  className,
  prose = true,
}: {
  html?: string | null
  className?: string
  prose?: boolean
}) {
  if (!html) return null

  if (looksLikeHtml(html)) {
    return (
      <div
        className={cn(prose && 'post-prose', className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <div className={cn(prose && 'post-prose', 'whitespace-pre-wrap', className)}>{html}</div>
  )
}

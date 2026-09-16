import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { Reveal } from '@/shared/ui/motion'

type ContainerSize = 'default' | 'content' | 'narrow' | 'wide'

/** Content grid only — visuals may break out via FullBleed / absolute layers. */
const SIZE: Record<ContainerSize, string> = {
  default: 'max-w-[1920px]',
  wide: 'max-w-[1920px]',
  content: 'max-w-6xl',
  narrow: 'max-w-5xl',
}

export function Container({
  children,
  className,
  size = 'default',
}: {
  children: ReactNode
  className?: string
  size?: ContainerSize
}) {
  return (
    <div
      className={cn(
        SIZE[size],
        'mx-auto w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24',
        className,
      )}
    >
      {children}
    </div>
  )
}

type SectionTone = 'default' | 'muted' | 'soft' | 'dark' | 'accent' | 'white'

const TONE: Record<SectionTone, string> = {
  default: 'bg-[#f7f4ef] text-[#111110]',
  muted: 'bg-[#f0ebe3] text-[#111110]',
  soft: 'bg-[#f7f4ef] text-[#111110]',
  dark: 'bg-[#111110] text-white',
  accent: 'bg-[#c8a97e] text-[#111110]',
  white: 'bg-white text-[#111110]',
}

export function Section({
  children,
  className,
  tone = 'default',
  id,
  compact,
}: {
  children: ReactNode
  className?: string
  tone?: SectionTone
  id?: string
  compact?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        TONE[tone],
        compact ? 'py-20 lg:py-28' : 'py-24 lg:py-36 xl:py-40',
        'relative overflow-hidden',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
  dark,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <Reveal
      className={cn(
        'mb-14 lg:mb-20 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow && (
          <p
            className={cn(
              'text-[12px] md:text-[13px] tracking-[0.35em] uppercase font-semibold mb-5',
              'text-[#c8a97e]',
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            'text-display font-normal font-display',
            dark ? 'text-white' : 'text-[#111110]',
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              'mt-5 text-lead max-w-xl',
              dark ? 'text-white/60' : 'text-[#6b6b68]',
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  )
}

export function PageShell({
  children,
  className,
  tone = 'default',
  size = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: SectionTone
  size?: ContainerSize
}) {
  return (
    <div className={cn(TONE[tone], 'min-h-[calc(100vh-4rem)] py-20 lg:py-28', className)}>
      <Container size={size}>{children}</Container>
    </div>
  )
}

export function PageTitle({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <Reveal className="mb-12 lg:mb-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="text-display font-display">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-lead text-[#6b6b68] max-w-2xl">{subtitle}</p>
        )}
      </div>
      {action}
    </Reveal>
  )
}

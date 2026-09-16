import type { ReactNode } from 'react'
import { Container } from '@/shared/ui/layout'
import { AmbientGlow, GoldRule, ServiceArt } from '@/features/services/ServiceArt'
import { cn } from '@/shared/lib/utils'
import { Parallax, Reveal } from '@/shared/ui/motion'

type PageHeroProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  image?: string
  art?: 0 | 1 | 2 | 3
  actions?: ReactNode
  children?: ReactNode
  className?: string
  compact?: boolean
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  art = 0,
  actions,
  children,
  className,
  compact,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-[#111110] text-white -mt-20 pt-20 min-h-[min(78svh,52rem)]',
        compact && 'min-h-[min(56svh,36rem)]',
        className,
      )}
    >
      <AmbientGlow />
      {image && (
        <Parallax speed={0.4} className="absolute inset-[-14%]">
          <div
            className="absolute inset-0 opacity-45 bg-cover bg-center ken-burns"
            style={{ backgroundImage: `url(${image})` }}
          />
        </Parallax>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#111110] via-[#111110]/88 to-[#111110]/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111110] via-transparent to-[#111110]/45" />

      <Parallax
        speed={-0.3}
        className="pointer-events-none absolute -right-[4%] top-[12%] w-[min(38vw,30rem)] opacity-60 hidden lg:block float-slow"
      >
        <ServiceArt variant={art} tone="gold" />
      </Parallax>

      <Container
        className={cn('relative z-10', compact ? 'py-16 lg:py-20' : 'py-20 lg:py-28 xl:py-32')}
      >
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 xl:col-span-9">
            {eyebrow && (
              <Reveal>
                <p className="text-[12px] md:text-[13px] tracking-[0.4em] uppercase text-[#c8a97e] font-semibold mb-6">
                  {eyebrow}
                </p>
              </Reveal>
            )}
            <Reveal delay={80}>
              <GoldRule className="mb-7 w-16 md:w-20" />
            </Reveal>
            <Reveal delay={140}>
              <h1 className="text-hero font-display font-normal mb-6 max-w-5xl">{title}</h1>
            </Reveal>
            {subtitle && (
              <Reveal delay={240}>
                <p className="text-lead text-white/65 max-w-2xl">{subtitle}</p>
              </Reveal>
            )}
            {actions && (
              <Reveal delay={320}>
                <div className="mt-10 flex flex-wrap gap-4">{actions}</div>
              </Reveal>
            )}
            {children}
          </div>
        </div>
      </Container>
    </section>
  )
}

export function WarmPage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('min-h-[calc(100vh-4rem)] bg-[#f7f4ef]', className)}>{children}</div>
}

export function DarkCtaBand({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string
  title: string
  text: string
  action: ReactNode
}) {
  return (
    <div className="relative overflow-hidden bg-[#111110] text-white px-8 py-16 lg:px-16 lg:py-20">
      <AmbientGlow />
      <Parallax
        speed={0.2}
        className="pointer-events-none absolute -right-10 top-0 w-72 opacity-30 hidden md:block"
      >
        <ServiceArt variant={2} tone="gold" />
      </Parallax>
      <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
        <Reveal className="lg:col-span-8">
          <p className="text-[12px] tracking-[0.35em] uppercase text-[#c8a97e] font-semibold mb-4">
            {eyebrow}
          </p>
          <h2 className="text-display font-display mb-4">{title}</h2>
          <p className="text-lead text-white/60 max-w-xl">{text}</p>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-4 lg:text-right">
          {action}
        </Reveal>
      </div>
    </div>
  )
}

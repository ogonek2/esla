import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { cn } from '@/shared/lib/utils'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Smooth scroll-linked parallax via rAF. */
export function useParallax<T extends HTMLElement>(
  speed = 0.25,
  enabled = true,
): RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    const el = ref.current
    if (!el) return

    let raf = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight || 1
      const progress = (rect.top + rect.height / 2 - viewH / 2) / viewH
      const y = progress * speed * -120
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
      raf = 0
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed, enabled])

  return ref
}

type RevealDirection = 'up' | 'left' | 'right' | 'scale'

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  as: Tag = 'div',
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: RevealDirection
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'span'
  once?: boolean
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) io.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  const dirClass =
    direction === 'left'
      ? 'reveal--left'
      : direction === 'right'
        ? 'reveal--right'
        : direction === 'scale'
          ? 'reveal--scale'
          : ''

  return (
    <Tag
      ref={ref as never}
      className={cn('reveal', dirClass, visible && 'reveal--in', className)}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

export function Parallax({
  children,
  className,
  speed = 0.28,
  style,
}: {
  children?: ReactNode
  className?: string
  speed?: number
  style?: CSSProperties
}) {
  const ref = useParallax<HTMLDivElement>(speed)
  return (
    <div ref={ref} className={cn('parallax-layer', className)} style={style}>
      {children}
    </div>
  )
}

/** Unrestricted full-viewport visual plane (outside content grid). */
export function FullBleed({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('full-bleed', className)}>{children}</div>
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('reveal-stagger', className)}>{children}</div>
}

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/shared/lib/utils'

type ShowcaseSliderProps = {
  children: ReactNode
  className?: string
  trackClassName?: string
  /** Approximate slide width for arrow jumps (px). */
  step?: number
  showArrows?: boolean
  dark?: boolean
  labelPrev?: string
  labelNext?: string
}

/** Large horizontal snap slider with arrow controls. */
export function ShowcaseSlider({
  children,
  className,
  trackClassName,
  step = 520,
  showArrows = true,
  dark = false,
  labelPrev = 'Prev',
  labelNext = 'Next',
}: ShowcaseSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [progress, setProgress] = useState(0)

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < max - 8)
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync, children])

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={trackRef}
        className={cn(
          'flex gap-5 lg:gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-2',
          'touch-pan-x',
          trackClassName,
        )}
      >
        {children}
      </div>

      {showArrows && (
        <div className="mt-8 flex items-center gap-6">
          <div className="flex gap-2">
            <button
              type="button"
              aria-label={labelPrev}
              disabled={!canPrev}
              onClick={() => scrollBy(-1)}
              className={cn(
                'h-12 w-12 border text-lg transition-colors disabled:opacity-25',
                dark
                  ? 'border-white/25 text-white hover:border-[#c8a97e] hover:text-[#c8a97e]'
                  : 'border-[#111110]/20 text-[#111110] hover:border-[#c8a97e] hover:text-[#c8a97e]',
              )}
            >
              ←
            </button>
            <button
              type="button"
              aria-label={labelNext}
              disabled={!canNext}
              onClick={() => scrollBy(1)}
              className={cn(
                'h-12 w-12 border text-lg transition-colors disabled:opacity-25',
                dark
                  ? 'border-white/25 text-white hover:border-[#c8a97e] hover:text-[#c8a97e]'
                  : 'border-[#111110]/20 text-[#111110] hover:border-[#c8a97e] hover:text-[#c8a97e]',
              )}
            >
              →
            </button>
          </div>
          <div
            className={cn(
              'h-px flex-1 max-w-xs overflow-hidden',
              dark ? 'bg-white/15' : 'bg-[#111110]/10',
            )}
          >
            <div
              className="h-full bg-[#c8a97e] transition-[width] duration-200"
              style={{ width: `${Math.max(8, progress * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

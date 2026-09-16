import { cn } from '@/shared/lib/utils'

/** Laconic line illustrations — champagne on dark / ink on light. */
export function ServiceArt({
  variant = 0,
  className,
  tone = 'gold',
}: {
  variant?: 0 | 1 | 2 | 3
  className?: string
  tone?: 'gold' | 'ink' | 'soft'
}) {
  const stroke =
    tone === 'ink' ? '#111110' : tone === 'soft' ? 'rgba(200,169,126,0.55)' : '#c8a97e'

  const common = {
    fill: 'none' as const,
    stroke,
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <svg
      viewBox="0 0 320 360"
      className={cn('w-full h-full', className)}
      aria-hidden
    >
      {variant === 0 && (
        <>
          <ellipse cx="160" cy="150" rx="78" ry="96" {...common} />
          <path d="M110 210 C120 250 140 280 160 290 C180 280 200 250 210 210" {...common} />
          <circle cx="160" cy="118" r="10" {...common} />
          <path d="M40 320 H280" {...common} opacity={0.35} />
          <path d="M70 40 H250" {...common} opacity={0.25} />
        </>
      )}
      {variant === 1 && (
        <>
          <rect x="70" y="60" width="180" height="220" rx="4" {...common} />
          <path d="M100 120 H220" {...common} />
          <path d="M100 160 H200" {...common} />
          <path d="M100 200 H190" {...common} />
          <circle cx="230" cy="280" r="28" {...common} />
          <path d="M218 280 L226 288 L244 268" {...common} />
        </>
      )}
      {variant === 2 && (
        <>
          <path d="M160 40 L250 100 L250 220 L160 280 L70 220 L70 100 Z" {...common} />
          <path d="M160 90 L210 120 L210 190 L160 220 L110 190 L110 120 Z" {...common} />
          <circle cx="160" cy="155" r="18" {...common} />
          <path d="M40 310 H280" {...common} opacity={0.3} />
        </>
      )}
      {variant === 3 && (
        <>
          <circle cx="160" cy="150" r="88" {...common} />
          <circle cx="160" cy="150" r="54" {...common} />
          <path d="M160 62 V100" {...common} />
          <path d="M160 200 V238" {...common} />
          <path d="M72 150 H110" {...common} />
          <path d="M210 150 H248" {...common} />
          <path d="M90 300 C130 270 190 270 230 300" {...common} />
        </>
      )}
    </svg>
  )
}

export function GoldRule({ className }: { className?: string }) {
  return (
    <div
      className={cn('h-px w-12 bg-gradient-to-r from-[#c8a97e] to-transparent', className)}
      aria-hidden
    />
  )
}

export function AmbientGlow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
      aria-hidden
    >
      <div className="absolute -top-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-[#c8a97e]/12 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[22rem] h-[18rem] rounded-full bg-[#c8a97e]/08 blur-3xl" />
    </div>
  )
}

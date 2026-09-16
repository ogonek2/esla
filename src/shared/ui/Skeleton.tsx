import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { Container } from '@/shared/ui/layout'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton-block rounded-[2px]', className)} aria-hidden />
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}

export function CardGridSkeleton({
  count = 6,
  cols = 'sm:grid-cols-2 lg:grid-cols-3',
}: {
  count?: number
  cols?: string
}) {
  return (
    <div className={cn('grid gap-4', cols)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-[#e2e1de] bg-white p-6 space-y-4">
          <Skeleton className="h-5 w-3/4" />
          <SkeletonText lines={2} />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  )
}

export function DoctorGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="w-full aspect-[3/4] mb-4" />
          <Skeleton className="h-3 w-1/3 mb-2" />
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function PriceListSkeleton({ groups = 3 }: { groups?: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: groups }).map((_, g) => (
        <div key={g} className="border border-[#e2e1de] bg-white">
          <div className="px-6 py-5 border-b border-[#e2e1de]">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 flex justify-between gap-4 border-b border-[#f0efec] last:border-0"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full max-w-md" />
              </div>
              <Skeleton className="h-4 w-20 shrink-0" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/** Shown below Hero while home API bundle loads. */
export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="bg-[#111110] py-20 lg:py-28">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 space-y-5">
              <Skeleton className="h-3 w-40 bg-white/10" />
              <Skeleton className="h-12 w-4/5 bg-white/10" />
              <Skeleton className="h-12 w-3/5 bg-white/10" />
              <Skeleton className="h-3 w-full max-w-md bg-white/10" />
              <Skeleton className="h-3 w-5/6 max-w-sm bg-white/10" />
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-12 w-40 bg-white/10" />
                <Skeleton className="h-12 w-28 bg-white/10" />
              </div>
            </div>
            <div className="lg:col-span-6">
              <Skeleton className="aspect-[3/4] w-full max-w-md lg:ml-auto bg-white/10" />
            </div>
          </div>
        </Container>
      </div>

      <div className="py-20 lg:py-28 bg-[#fafaf9]">
        <Container>
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-10 w-64 mb-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e2e1de]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white p-8 space-y-4 min-h-[11rem]">
                <Skeleton className="h-5 w-3/4" />
                <SkeletonText lines={2} />
                <Skeleton className="h-3 w-1/3 mt-auto" />
              </div>
            ))}
          </div>
        </Container>
      </div>

      <div className="py-20 lg:py-28 bg-[#f4f3f1]">
        <Container>
          <Skeleton className="h-10 w-56 mb-12" />
          <DoctorGridSkeleton />
        </Container>
      </div>
    </div>
  )
}

export function PageLoading({ children }: { children?: ReactNode }) {
  return (
    <div className="py-16 lg:py-24" aria-busy="true">
      {children || (
        <Container className="space-y-8">
          <Skeleton className="h-10 w-64" />
          <CardGridSkeleton />
        </Container>
      )}
    </div>
  )
}

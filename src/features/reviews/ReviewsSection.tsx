import { useTranslation } from 'react-i18next'
import type { Review } from '@/shared/lib/types'
import { Container, Section, SectionHeader } from '@/shared/ui/layout'

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const { t } = useTranslation()
  if (!reviews.length) return null

  return (
    <Section id="reviews" tone="dark">
      <Container>
        <SectionHeader eyebrow={t('reviews.eyebrow')} title={t('reviews.title')} dark />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {reviews.slice(0, 6).map((r) => (
            <div key={r.id} className="bg-[#111110] p-8 lg:p-10 flex flex-col">
              {r.rating != null && (
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i} className="text-[#c8a97e] text-lg">
                      ★
                    </span>
                  ))}
                </div>
              )}
              {r.text && (
                <p className="text-white/80 text-[15px] leading-relaxed mb-8 font-light italic font-display flex-1">
                  &ldquo;{r.text}&rdquo;
                </p>
              )}
              <div className="border-t border-white/10 pt-6 mt-auto">
                <p className="font-semibold text-[14px]">{r.author_name}</p>
                {r.source && <p className="text-[12px] text-white/40 mt-0.5">{r.source}</p>}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

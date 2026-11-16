import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Section, SectionHeader } from '@/shared/ui/layout'
import { Reveal } from '@/shared/ui/motion'

const ELFSIGHT_SCRIPT = 'https://elfsightcdn.com/platform.js'
const ELFSIGHT_APP_ID = 'e772082e-6bea-419b-9f89-87dd3eddd283'

export function InstagramFeedSection() {
  const { t } = useTranslation()

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${ELFSIGHT_SCRIPT}"]`,
    )
    if (existing) return

    const script = document.createElement('script')
    script.src = ELFSIGHT_SCRIPT
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <Section id="instagram" tone="white" className="overflow-x-clip">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={t('instagram.eyebrow')}
            title={t('instagram.title')}
            subtitle={t('instagram.subtitle')}
          />
        </Reveal>
        <Reveal delay={100}>
          <div
            className={`elfsight-app-${ELFSIGHT_APP_ID}`}
            data-elfsight-app-lazy
          />
        </Reveal>
      </Container>
    </Section>
  )
}

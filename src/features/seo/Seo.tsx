import { useEffect } from 'react'

type SeoProps = {
  title?: string
  description?: string
  noindex?: boolean
}

export function Seo({ title, description, noindex }: SeoProps) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Esla`
      : 'Esla — медичний центр пластичної хірургії'
    document.title = fullTitle

    const ensureMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name'
      let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.content = content
    }

    if (description) {
      ensureMeta('description', description)
      ensureMeta('og:description', description, true)
    }
    ensureMeta('og:title', fullTitle, true)
    ensureMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, noindex])

  return null
}

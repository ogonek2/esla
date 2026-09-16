/** Visual identity per service category — premium clinic atmosphere. */
export type CategoryVisual = {
  slug: string
  image: string
  tint: string
  accent: string
}

export const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  otolaryngology: {
    slug: 'otolaryngology',
    image:
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=900&fit=crop&auto=format',
    tint: '#1c2428',
    accent: '#9eb3b8',
  },
  'lor-surgery': {
    slug: 'lor-surgery',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=900&fit=crop&auto=format',
    tint: '#1a1f24',
    accent: '#a8b5c0',
  },
  'face-neck-plastics': {
    slug: 'face-neck-plastics',
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&h=900&fit=crop&auto=format',
    tint: '#1f1a18',
    accent: '#d4b896',
  },
  endolift: {
    slug: 'endolift',
    image:
      'https://images.unsplash.com/photo-1785861378703-1c991c4548ef?w=1200&h=900&fit=crop&auto=format',
    tint: '#141210',
    accent: '#c8a97e',
  },
  'body-care': {
    slug: 'body-care',
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=900&fit=crop&auto=format',
    tint: '#1a1816',
    accent: '#c4a882',
  },
  cosmetology: {
    slug: 'cosmetology',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&h=900&fit=crop&auto=format',
    tint: '#1c1714',
    accent: '#c8a97e',
  },
  checkup: {
    slug: 'checkup',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=900&fit=crop&auto=format',
    tint: '#161a1c',
    accent: '#8fa3ab',
  },
}

export const DEFAULT_CATEGORY_VISUAL: CategoryVisual = {
  slug: 'default',
  image:
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=900&fit=crop&auto=format',
  tint: '#161412',
  accent: '#c8a97e',
}

export function getCategoryVisual(slug?: string | null): CategoryVisual {
  if (!slug) return DEFAULT_CATEGORY_VISUAL
  return CATEGORY_VISUALS[slug] || DEFAULT_CATEGORY_VISUAL
}

/** Deterministic soft index for service art variants */
export function serviceArtVariant(slug: string): 0 | 1 | 2 | 3 {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * (i + 1)) % 4
  return h as 0 | 1 | 2 | 3
}

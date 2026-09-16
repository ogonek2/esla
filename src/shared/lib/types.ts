export type SeoFields = {
  title?: string | null
  description?: string | null
}

export type ServiceCategory = {
  id: number
  slug: string
  name: string
  description?: string | null
  sort: number
  services_count?: number
}

export type ServiceJourneyStep = {
  title?: string | null
  text?: string | null
}

export type ServiceTrustItem = {
  label?: string | null
  text?: string | null
}

export type Service = {
  id: number
  slug: string
  name: string
  short_description?: string | null
  description?: string | null
  indications?: string | null
  contraindications?: string | null
  price_from?: number | null
  price_label?: string | null
  is_featured: boolean
  sort: number
  cover_url?: string | null
  about_title?: string | null
  journey_title?: string | null
  journey_steps?: ServiceJourneyStep[]
  trust_items?: ServiceTrustItem[]
  seo?: SeoFields
  category?: ServiceCategory | null
  doctors?: Doctor[]
  portfolio?: PortfolioCase[]
}

export type Doctor = {
  id: number
  slug: string
  name: string
  position?: string | null
  bio?: string | null
  experience_years?: number | null
  photo_url?: string | null
  sort: number
  seo?: SeoFields
  services?: Service[]
  portfolio?: PortfolioCase[]
}

export type PortfolioCase = {
  id: number
  slug: string
  title: string
  description?: string | null
  before_url?: string | null
  after_url?: string | null
  sort: number
  service?: Service | null
  doctor?: Doctor | null
}

export type Review = {
  id: number
  author_name: string
  text: string
  source?: string | null
  rating?: number | null
  photo_url?: string | null
  sort: number
}

export type FaqItem = {
  id: number
  category_slug?: string | null
  question: string
  answer: string
  sort: number
}

export type Post = {
  id: number
  slug: string
  title: string
  excerpt?: string | null
  body?: string | null
  blocks?: ContentBlock[]
  cover_url?: string | null
  published_at?: string | null
  seo?: SeoFields
}

export type ContentBlock = {
  type: string
  data: Record<string, unknown>
}

export type Page = {
  id: number
  slug: string
  title: string
  body?: string | null
  seo?: SeoFields
}

export type Clinic = {
  phones: string[]
  messengers: Record<string, string>
  address?: string | null
  schedule?: string | null
  map: {
    embed_url?: string | null
    lat?: string | null
    lng?: string | null
  }
  social: Record<string, string>
  email?: string | null
  analytics: {
    ga4_id?: string | null
    gtm_id?: string | null
    meta_pixel_id?: string | null
    tiktok_pixel_id?: string | null
  }
  locale: string
}

export type Paginated<T> = {
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links?: Record<string, string | null>
}

export type SearchResult = {
  data: {
    services: Service[]
    doctors: Doctor[]
    posts: Post[]
    faq: FaqItem[]
  }
  meta: { q: string; locale: string }
}

export type LeadPayload = {
  name: string
  phone: string
  email?: string
  service_id?: number
  service_slug?: string
  doctor_id?: number
  doctor_slug?: string
  preferred_date?: string
  preferred_time?: string
  messenger?: 'telegram' | 'whatsapp' | 'viber'
  comment?: string
  consent: boolean
  page_url?: string
  locale?: string
  website?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

export type LeadResponse = {
  message: string
  data: { id: number; type: string; status: string; created_at?: string }
}

export type ServiceDetailResponse = {
  data: Service
  faq: FaqItem[]
}

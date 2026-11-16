/** Public site origin used for canonical / OG / sitemap references. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  (import.meta.env.DEV ? 'http://localhost:5173' : 'https://esla.com.ua')
).replace(/\/$/, '')

export const SITE_NAME = 'ESLA'
export const DEFAULT_TITLE = 'Esla — медичний центр пластичної хірургії'
export const DEFAULT_DESCRIPTION =
  'Esla — медичний центр пластичної хірургії. Ендоліфт, пластика обличчя, ЛОР-хірургія, косметологія.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`

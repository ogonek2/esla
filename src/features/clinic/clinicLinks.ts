/** Normalize admin-entered messenger / social / phone values into usable hrefs. */
export function externalHref(value: string): string {
  const v = value.trim()
  if (!v) return '#'
  if (/^(https?:|tel:|mailto:|viber:|tg:|whatsapp:|skype:)/i.test(v)) return v
  if (v.includes('@') && !/\s/.test(v)) return `mailto:${v}`
  if (/^\+?\d[\d\s()-]{7,}$/.test(v)) return `tel:${v.replace(/[^\d+]/g, '')}`
  if (v.startsWith('//')) return `https:${v}`
  if (v.includes('.') && !v.includes(' ')) return `https://${v.replace(/^\/+/, '')}`
  return v
}

export function filledEntries(
  record: Record<string, string> | null | undefined,
): Array<[string, string]> {
  if (!record) return []
  return Object.entries(record).filter(([, v]) => Boolean(v && String(v).trim()))
}

export function clinicPhones(phones: string[] | null | undefined): string[] {
  return (phones || []).map((p) => String(p || '').trim()).filter(Boolean)
}

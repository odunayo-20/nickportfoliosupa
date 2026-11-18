export type TocHeading = { id: string; text: string; level: 2 | 3 }

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents (č → c)
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'section'

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')

/**
 * Adds stable `id`s to <h2>/<h3> in rich-text HTML (from the TinyMCE editor) and returns
 * the heading list for a table of contents. Existing ids are kept.
 */
export function addHeadingIds(html: string): { html: string; headings: TocHeading[] } {
  const headings: TocHeading[] = []
  const used = new Set<string>()

  const out = html.replace(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi, (full, lvl: string, attrs = '', inner: string) => {
    const text = decode(inner.replace(/<[^>]*>/g, '')).trim()
    if (!text) return full

    const existing = /\sid=["']([^"']+)["']/i.exec(attrs)?.[1]
    let id = existing || slugify(text)
    if (!existing) {
      let n = 2
      const base = id
      while (used.has(id)) id = `${base}-${n++}`
    }
    used.add(id)
    headings.push({ id, text, level: Number(lvl) as 2 | 3 })

    return existing ? full : `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`
  })

  return { html: out, headings }
}

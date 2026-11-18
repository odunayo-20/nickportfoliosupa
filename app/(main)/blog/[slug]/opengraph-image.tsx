import { getPostBySlug } from '@/actions/blog'
import { getSettings } from '@/actions/settings'
import { OG_SIZE, renderOgCard } from '@/lib/og'

export const alt = 'Blog article'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSettings()])
  const p = (post ?? {}) as { title?: string; category?: string | null; summary?: string | null; cover_image_url?: string | null; image_url?: string | null }
  return renderOgCard({
    site: settings?.site_title || 'Nikola Srdoc',
    kicker: p.category ? `Article · ${p.category}` : 'Article',
    title: p.title || 'Article',
    subtitle: p.summary ?? null,
    image: p.cover_image_url || p.image_url || null,
  })
}

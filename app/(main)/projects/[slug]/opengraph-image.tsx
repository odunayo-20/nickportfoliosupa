import { getProjectBySlug } from '@/actions/projects'
import { getSettings } from '@/actions/settings'
import { OG_SIZE, renderOgCard } from '@/lib/og'

export const alt = 'Project case study'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSettings()])
  const p = (project ?? {}) as { title?: string; category?: string | null; tech_stack?: string[] | null; imageUrl?: string | null; image_url?: string | null }
  return renderOgCard({
    site: settings?.site_title || 'Nikola Srdoc',
    kicker: p.category ? `Case study · ${p.category}` : 'Case study',
    title: p.title || 'Project',
    subtitle: (p.tech_stack ?? []).slice(0, 5).join(' · ') || null,
    image: p.imageUrl || p.image_url || null,
  })
}

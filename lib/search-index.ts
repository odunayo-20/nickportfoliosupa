import { getPublishedProjects } from '@/actions/projects'
import { getPublishedPosts } from '@/actions/blog'

export type SearchKind = 'page' | 'project' | 'post'
export type SearchEntry = { kind: SearchKind; title: string; href: string; hint?: string; keywords?: string }

const PAGES: SearchEntry[] = [
  { kind: 'page', title: 'Home', href: '/' },
  { kind: 'page', title: 'About', href: '/about', keywords: 'experience timeline cv resume' },
  { kind: 'page', title: 'Services', href: '/services', keywords: 'hire freelance consulting' },
  { kind: 'page', title: 'Projects', href: '/projects', keywords: 'work portfolio case study' },
  { kind: 'page', title: 'Blog', href: '/blog', keywords: 'articles posts writing' },
  { kind: 'page', title: 'Contact', href: '/contact', keywords: 'email message hire' },
  { kind: 'page', title: 'Privacy policy', href: '/privacy' },
  { kind: 'page', title: 'Cookie policy', href: '/cookies' },
]

type Row = { slug?: string; title?: string; category?: string | null; tech_stack?: string[] | null; tags?: string[] | null; excerpt?: string | null }

/** Small index for the ⌘K palette: static pages + published projects and posts (cached actions). */
export async function getSearchIndex(): Promise<SearchEntry[]> {
  const [projects, posts] = await Promise.all([
    getPublishedProjects().catch(() => []),
    getPublishedPosts().catch(() => []),
  ])
  const proj = ((projects ?? []) as Row[])
    .filter((p) => p.slug && p.title)
    .map((p) => ({
      kind: 'project' as const,
      title: p.title!,
      href: `/projects/${p.slug}`,
      hint: p.category ?? undefined,
      keywords: (p.tech_stack ?? []).join(' '),
    }))
  const blog = ((posts ?? []) as Row[])
    .filter((p) => p.slug && p.title)
    .map((p) => ({
      kind: 'post' as const,
      title: p.title!,
      href: `/blog/${p.slug}`,
      hint: p.category ?? undefined,
      keywords: [...(p.tags ?? []), p.excerpt ?? ''].join(' ').slice(0, 300),
    }))
  return [...PAGES, ...proj, ...blog]
}

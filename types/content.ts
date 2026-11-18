/**
 * Shapes of the content records the public pages render. Fields are optional/nullable where the
 * database allows it; server actions may attach extra fields that these components don't use.
 */

export type PostSummary = {
  id: string
  slug: string
  title: string
  category?: string | null
  excerpt?: string | null
  cover_image_url?: string | null
  image_url?: string | null
  created_at?: string | null
}

export type PostDetail = PostSummary & {
  content?: string | null
  detail_image_url?: string | null
  author?: { name?: string | null; avatar_url?: string | null; role?: string | null } | null
}

export type CommentItem = {
  id?: string
  author_name?: string | null
  content?: string | null
  created_at?: string | null
}

export type ProjectSummary = {
  id: string
  slug: string
  title: string
  category?: string | null
  imageUrl?: string | null
  image_url?: string | null
  tech_stack?: string[] | null
  is_featured?: boolean | null
  display_order?: number | null
}

export type ProjectDetail = ProjectSummary & {
  description?: string | null
  content?: string | null
  additionalImages?: string[]
  github_url?: string | null
  live_url?: string | null
  app_store_url?: string | null
  play_store_url?: string | null
}

/** Formats an ISO date for display; empty string when missing (never reads the clock during render). */
export function formatDate(value: string | null | undefined, month: 'long' | 'short' = 'short') {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month, day: 'numeric', year: 'numeric' })
}

/**
 * Hand-edited site content that has no admin UI (yet).
 * Sections that read from here hide themselves while their list is empty.
 */

export type Testimonial = { quote: string; name: string; role?: string }

/**
 * Real client/colleague quotes only. The home "Kind words" section stays hidden until this
 * has at least one entry. Example:
 *   { quote: 'Shipped both apps from one codebase…', name: 'Jane Doe', role: 'CTO, Acme' },
 */
export const TESTIMONIALS: Testimonial[] = []

/** Availability badge (hero + navbar). Set `available: false` to hide it. */
export const AVAILABILITY = {
  available: true,
  label: 'Available for new projects',
}

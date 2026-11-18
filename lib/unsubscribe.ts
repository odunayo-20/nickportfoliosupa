import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Signed unsubscribe links. Without a token, anyone could unsubscribe any address (or every
 * address) just by knowing it. The token is an HMAC of the lower-cased email.
 *
 * Secret: UNSUBSCRIBE_SECRET if set, otherwise the service-role key (server-only either way).
 */
function secret(): string {
  const s = process.env.UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!s) throw new Error('UNSUBSCRIBE_SECRET / SUPABASE_SERVICE_ROLE_KEY is not configured')
  return s
}

export function unsubscribeToken(email: string): string {
  return createHmac('sha256', secret()).update(`unsubscribe:${email.trim().toLowerCase()}`).digest('base64url')
}

export function verifyUnsubscribeToken(email: string, token: string | null | undefined): boolean {
  if (!token) return false
  const expected = Buffer.from(unsubscribeToken(email))
  const given = Buffer.from(token)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

export function unsubscribeUrl(email: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const e = email.trim().toLowerCase()
  return `${base}/unsubscribe?email=${encodeURIComponent(e)}&token=${unsubscribeToken(e)}`
}

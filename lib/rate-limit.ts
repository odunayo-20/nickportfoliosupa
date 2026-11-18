import { headers } from 'next/headers'

/**
 * Small in-memory sliding-window limiter for public server actions (contact form, newsletter,
 * comments, unsubscribe). Per server instance — it stops casual floods and scripted loops from
 * one IP, not a distributed attack. For that, put Vercel Firewall / Upstash rate limiting in front.
 */
const buckets = new Map<string, number[]>()

export async function clientIp(): Promise<string> {
  const h = await headers()
  return (h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim()
}

/** Returns true when the call is allowed. */
export async function rateLimit(scope: string, limit: number, windowMs: number): Promise<boolean> {
  const key = `${scope}:${await clientIp()}`
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    buckets.set(key, hits)
    return false
  }
  hits.push(now)
  buckets.set(key, hits)

  // Keep the map from growing without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k)
  }
  return true
}

export const RATE_LIMITED = 'Too many requests — please wait a few minutes and try again.'

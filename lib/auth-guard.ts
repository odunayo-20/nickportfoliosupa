import { createClient } from '@/lib/server'
import { isEmailWhitelisted } from '@/lib/whitelist'

/**
 * Every exported function in a 'use server' file is a public POST endpoint — the /admin proxy
 * redirect does not protect it. Call this first in every admin-only server action.
 *
 * Verifies the session with Supabase Auth (getUser, not just the cookie) and that the user's
 * email is on the admin whitelist. Throws otherwise.
 *
 * Deliberately NOT a 'use server' module, so the guard itself is not exposed as an action.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Whitelisted AND confirmed: an unconfirmed account for a whitelisted address proves nothing.
  if (!user?.email || !user.email_confirmed_at || !(await isEmailWhitelisted(user.email))) {
    throw new Error('Unauthorized')
  }

  return { supabase, user }
}

/** Same check, but returns null instead of throwing (for actions that return `{ error }`). */
export async function getAdmin() {
  try {
    return await requireAdmin()
  } catch {
    return null
  }
}

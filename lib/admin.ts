import { createClient } from '@supabase/supabase-js'

export const createAdminClient = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (Supabase → Project Settings → API Keys → service_role) and to the hosting environment.'
    )
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

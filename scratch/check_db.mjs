import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

async function checkDatabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log('--- TABLES ---')
  // We can't easily list tables via anon key, but we can check if they exist by querying them
  const tables = ['posts', 'projects', 'media', 'profiles', 'comments', 'folders']
  
  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .limit(1)

    if (error) {
      console.log(`[${table}]: Error or Not Found - ${error.message}`)
    } else {
      console.log(`[${table}]: Exists - ${count} rows`)
    }
  }

  console.log('\n--- SAMPLE POST ---')
  const { data: post } = await supabase.from('posts').select('*').limit(1).single()
  if (post) {
      console.log(JSON.stringify(post, null, 2))
  }
}

checkDatabase()

// frontend/src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local. ' +
      'Make sure you created frontend/.env.local and restarted the dev server.'
  )
}

// export the client (will throw inside lib if keys are wrong, but message above helps)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

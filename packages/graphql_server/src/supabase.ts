import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

//const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)

const supabase = createClient<Database>('url', 'key')

export default supabase

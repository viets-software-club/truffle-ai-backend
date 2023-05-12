import { createClient } from '@supabase/supabase-js'

class Database {
  private static supabaseUrl = 'https://yipnhkmklmbuxjwzpipg.supabase.co'
  private static key: string =
    process.env.SUPABASE_ANON_KEY != null ? process.env.SUPABASE_ANON_KEY : ''

  private static supabase = createClient(this.supabaseUrl, this.key)
  static getSupabaseDatabase() {
    if (this.supabase == null) {
      this.supabase = createClient(this.supabaseUrl, this.key)
    }
    return this.supabase
  }
}
export default Database

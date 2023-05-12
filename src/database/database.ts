import { createClient } from '@supabase/supabase-js'
import { SupabaseClient } from '@supabase/supabase-js/src'
import { GenericSchema } from '@supabase/supabase-js/src/lib/types'

class Database {
  private static supabaseUrl = 'https://yipnhkmklmbuxjwzpipg.supabase.co'
  private static key: string =
    process.env.SUPABASE_ANON_KEY != null ? process.env.SUPABASE_ANON_KEY : ''
  supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG5oa21rbG1idXhqd3pwaXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM0OTAwMjYsImV4cCI6MTk5OTA2NjAyNn0.5H4WqY1uUq9IiCGrPvM96NSrTLO6pPUUS1gMb4Ubxds'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  private static supabase: SupabaseClient<never, string, never> = createClient(
    this.supabaseUrl,
    this.key
  )
  static getSupabaseDatabase(): SupabaseClient<never, string, never> {
    if (this.supabase == null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
      this.supabase = createClient(this.supabaseUrl, this.key)
    }
    return this.supabase
  }
}
export default Database

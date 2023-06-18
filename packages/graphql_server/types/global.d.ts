export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: number
      NODE_ENV: 'development' | 'production'
      SUPABASE_URL: string
      SUPABASE_API_KEY: string
    }
  }
}

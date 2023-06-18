export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: number
      NODE_ENV: 'development' | 'production'
      OPENAI_API_KEY: string
      GITHUB_API_TOKEN: string
      GITHUB_API_URL: string
      SUPABASE_URL: string
      SUPABASE_API_KEY: string
    }
  }
}

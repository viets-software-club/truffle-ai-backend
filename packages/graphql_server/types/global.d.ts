export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: number
      NODE_ENV: 'development' | 'production'
      SUPABASE_URL: string
      SUPABASE_API_KEY: string
      SCRAPING_BOT_API_KEY: string
      SCRAPING_BOT_USER_NAME: string
      OPENAI_API_KEY: string
      GITHUB_API_TOKEN: string
    }
  }
}

import app from './server'
import { getRepoFounders } from './api/githubApi'

void getRepoFounders('vercel', 'next.js').then(r => console.log(r))

void app.listen({ host: '0.0.0.0', port: process.env.SERVER_PORT || 3001 })

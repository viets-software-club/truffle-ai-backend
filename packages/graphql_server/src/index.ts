import app from './server'
import { getCompanyInfosFromLinkedIn } from './LinkedInScrapingService'

void getCompanyInfosFromLinkedIn('google').then((r) => console.log(r))
void app.listen({ host: '0.0.0.0', port: process.env.SERVER_PORT || 3001 })

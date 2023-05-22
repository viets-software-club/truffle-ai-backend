import app from './server'
import { getCompanyInfosFromLinkedIn } from './LinkedInScrapingService'

void getCompanyInfosFromLinkedIn('ferrari').then((r) => console.log(r))
void app.listen({ port: 3000 })

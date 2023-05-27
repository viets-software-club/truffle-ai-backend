import app from './server'
import twitterScrapingService from './service/twitter-scraping-service'

void twitterScrapingService.getTwitterUserByHandle('TuckerCarlson').then((r) => console.log(r))

void app.listen({ host: '0.0.0.0', port: process.env.SERVER_PORT || 3001 })
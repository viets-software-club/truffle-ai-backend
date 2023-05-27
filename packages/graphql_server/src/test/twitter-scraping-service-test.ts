import twitterScrapingService from '../service/twitter-scraping-service'

void twitterScrapingService.getTwitterUserByHandle('elonmusk').then((r) => console.log(r))

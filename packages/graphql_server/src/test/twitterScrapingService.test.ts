import twitterScrapingService from '../api/twitterScrapingService'

void twitterScrapingService.getTwitterUserByHandle('elonmusk').then((r) => console.log(r))

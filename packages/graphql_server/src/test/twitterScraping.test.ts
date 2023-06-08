import twitterScrapingService from '../scraping/twitterScraping'

void twitterScrapingService.getTwitterUserByHandle('elonmusk').then((r) => console.log(r))

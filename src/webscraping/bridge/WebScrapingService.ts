import { WebData, WebDataMetadata } from './WebData'
import { IScraper } from '../scrapers/IScraper'
import GithubRepoScraper from '../scrapers/GithubRepoScraper'

class WebScrapingService {
  private _scrapers: IScraper[] = [new GithubRepoScraper()]
  startScraping(): WebData<never>[] {
    const webData: WebData<never>[] = []
    for (const scraper of this._scrapers) {
      webData.push(scraper.getData())
    }
    return webData
  }
}

export default WebScrapingService

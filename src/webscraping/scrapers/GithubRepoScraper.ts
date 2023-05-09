import { IScraper } from './IScraper'
import { WebData, WebDataMetadata } from '../bridge/WebData'

class GithubRepoScraper implements IScraper {
  clearData(): void {
    //TODO do cleaning here
  }

  getData(): WebData<never> {
    return new WebData<never>([], new WebDataMetadata('', '', ''))
  }

  startScraping(): void {
    //TODO do scraping here
  }
}

export default GithubRepoScraper

import { WebData } from '../bridge/WebData'

export interface IScraper {
  startScraping(): void
  clearData(): void
  getData(): WebData<never>
}

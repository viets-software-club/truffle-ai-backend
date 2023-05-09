export class WebData<T> {
  webData: T[]
  metadata: WebDataMetadata

  constructor(webData: T[], metadata: WebDataMetadata) {
    this.webData = webData
    this.metadata = metadata
  }
}

export class WebDataMetadata {
  source: string
  length: string
  date: string

  constructor(source: string, length: string, date: string) {
    this.source = source
    this.length = length
    this.date = date
  }
}

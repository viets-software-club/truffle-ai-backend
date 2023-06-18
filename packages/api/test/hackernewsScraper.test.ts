import { searchHackerNewsStories } from '../src/scraper/hackernewsScraper'

async function testHackerNewsScraping(repoName: string) {
  console.log(await searchHackerNewsStories(repoName))
}

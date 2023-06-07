import { searchHackerNewsStories } from '../scraping/hackerNewsScraping'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function testHackerNewsScraping(repoName: string) {
  //returns the comments
  console.log(await searchHackerNewsStories(repoName))
}

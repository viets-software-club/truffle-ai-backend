import { getRepositoryTopics } from '../scraping/githubScraping'

function testGetRepositoryTopics() {
  //get real comments from method in hackerNewsScraper. E.g. searchHackerNewsStories('SuperAGI')

  console.log(getRepositoryTopics('TransformerOptimus', 'SuperAGI'))
}

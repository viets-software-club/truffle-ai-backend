import { getRepositoryTopics } from '../api/githubApi'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testGetRepositoryTopics() {
  //get the real comments from method in hackerNewsScraper. E.g. searchHackerNewsStories('SuperAGI')

  console.log(getRepositoryTopics('TransformerOptimus', 'SuperAGI'))
}

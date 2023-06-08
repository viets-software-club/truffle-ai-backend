import { getRepositoryTopics } from '../api/githubApi'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function testGetRepositoryTopics(repoFounder: string, repoName: string) {
  //get the real comments from method in hackerNewsScraper. E.g. searchHackerNewsStories('SuperAGI')

  console.log(await getRepositoryTopics(repoFounder, repoName, 'token'))
}

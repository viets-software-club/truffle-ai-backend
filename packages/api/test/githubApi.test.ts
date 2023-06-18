import { getRepositoryTopics, getContributorCount } from '../src/external-apis/github-api/githubApi'

// get the real comments from method in hackerNewsScraper. E.g. searchHackerNewsStories('SuperAGI')
async function testGetRepositoryTopics(repoFounder: string, repoName: string) {
  console.log(await getRepositoryTopics(repoFounder, repoName, process.env.GITHUB_API_TOKEN))
}

// test function that calls the method and prints out all contributors
async function testGetContributorCount(owner: string, repo: string) {
  console.log(await getContributorCount(owner, repo, process.env.GITHUB_API_TOKEN))
}

void testGetContributorCount('iv-org', 'invidious')
void testGetContributorCount('microsoft', 'guidance')
void testGetContributorCount('smol-ai', 'developer')
void testGetContributorCount('sunner', 'ChatALL')
void testGetContributorCount('google', 'comprehensive-rust')

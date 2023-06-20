import { getRepositoryTopics, getContributorCount } from '../api/githubApi'
import { fetchTrendingRepos } from '../scraping/githubScraping'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function testGetRepositoryTopics(repoFounder: string, repoName: string) {
  console.log(await getRepositoryTopics(repoFounder, repoName, process.env.GITHUB_API_TOKEN))
}

//test function that calls the method and prints out all contributors
export async function testGetContributorCount(owner: string, repo: string) {
  console.log(await getContributorCount(owner, repo, '')) //here we need to pass an auth token
}

async function contributorCountForTrendingRepos() {
  const repos = await fetchTrendingRepos('daily')
  for (let i = 0; i < repos.length - 1; i += 2) {
    const currentString: string = repos[i]
    const nextString: string = repos[i + 1]
    void testGetContributorCount(currentString, nextString)
  }

  const weeklyRepos = await fetchTrendingRepos('weekly')
  for (let i = 0; i < weeklyRepos.length - 1; i += 2) {
    const currentString: string = weeklyRepos[i]
    const nextString: string = weeklyRepos[i + 1]
    void testGetContributorCount(currentString, nextString)
  }

  const monthlyRepos = await fetchTrendingRepos('monthly')
  for (let i = 0; i < monthlyRepos.length - 1; i += 2) {
    const currentString: string = monthlyRepos[i]
    const nextString: string = monthlyRepos[i + 1]
    void testGetContributorCount(currentString, nextString)
  }
}

void contributorCountForTrendingRepos()

/*
testGetContributorCount('iv-org', 'invidious') //268
testGetContributorCount('microsoft', 'guidance') //98
testGetContributorCount('smol-ai', 'developer') //14
testGetContributorCount('sunner', 'ChatALL') //15
testGetContributorCount('google', 'comprehensive-rust') //155*/

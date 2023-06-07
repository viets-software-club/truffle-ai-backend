import { timeMode } from '../../types/githubScraping'
import * as github from '../api/githubApi'
import * as eli5 from '../api/openAIApi'
import * as starHistory from '../starHistory/starHistory'
import * as hackernews from '../scraping/hackerNewsScraping'

/** Main function to test the functionality of the different methods
 * and how to correctly call them and what the intended workflow is about
 * @todo Github and OpenAI token still have to be added manually
 * @param {string} timeMode - should be 'daily', 'weekly' or 'monthly' => defines the scope of which repos and developers the methods looks at
 */
async function main(timeMode: timeMode) {
  const trendingSplit: string[] | undefined = await github.fetchTrendingRepos(timeMode)

  // your personal GitHub authToken
  const authToken: string = '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' //process.env.GITHUB_API_TOKEN
  // your personal OpenAI API Key
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const OPENAI_API_KEY: string = 'sk - zl68qSX7NpVJ4HZlsJt4T3BlbkFJaCdGia3cjbdxOZi7g4zV' //process.env.OPENAI_API_KEY

  // check if any repos were actually found
  if (!trendingSplit) {
    console.log("Repos couldn't be scraped")
    process.exit()
  }

  for (let i = 0; i < trendingSplit.length / 2; i++) {
    const owner = trendingSplit[2 * i]
    const name = trendingSplit[2 * i + 1]
    const query = `query {
        repository(owner: "${owner}", name: "${name}") {
          name    
          description
          url
          createdAt
          stargazers {
            totalCount
          }
          forks {
            totalCount
          }
          primaryLanguage {
            name
          }
        }
      }`

    console.log(await github.getRepoInfo(query, 'Bearer ' + authToken))

    // TODO check if the repo has more than a 1k stars: repoInfo.stargazers.totalCount < 1000

    const readme: string = await github.fetchRepositoryReadme(owner, name)

    if (readme != null) {
      // call openai api
      console.log('Eli5:')
      console.log(await eli5.getELI5FromReadMe(readme)) //prints summarised readme
      const categories = await github.getRepositoryTopics(owner, readme)
      console.log('Categories:')
      console.log(eli5.categorizeProjectGeneral(categories, readme))
    }
    console.log('hackernewsstories:')
    const [comments, links] = await hackernews.searchHackerNewsStories(name)
    //hiermit noch die eli5 method aufrufen und checken ob der String leer ist. 
    console.log(await)

    if (links == ' ' && comments == ' ') {
    }
    // get the star history of the repo
    console.log(await starHistory.getRepoStarRecords(owner + '/' + name, authToken, 10))

    // get the contributor count of the repo
    console.log(await github.getContributorCount(owner, name, authToken))
  }
  // get the developers
  // console.log(scrape.fetchTrendingDevelopers(timeMode))
}

void main('daily')

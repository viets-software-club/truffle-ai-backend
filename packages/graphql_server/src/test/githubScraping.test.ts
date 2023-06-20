import { timeMode } from '../../types/githubScraping'
import * as github from '../api/githubApi'
import * as githubScraping from '../scraping/githubScraping'
import * as eli5 from '../api/openAIApi'
import * as starHistory from '../githubHistory/starHistory'
import * as forkHistory from '../githubHistory/forkHistory'
import * as issueHistory from '../githubHistory/issueHistory'
import * as hackernews from '../scraping/hackerNewsScraping'
import * as utils from '../githubHistory/utils'

/** Main function to test the functionality of the different methods
 * and how to correctly call them and what the intended workflow is about
 * @todo Github and OpenAI token still have to be added manually
 * @param {string} timeMode - should be 'daily', 'weekly' or 'monthly' => defines the scope of which repos and developers the methods looks at
 *
 *
 *
 *
 *
 * You need to add the process.env.OPenai_API_KEY because it needs to be used
 *
 */
export async function main(timeMode: timeMode, firstNRepos: number) {
  const trendingSplit: string[] | undefined = await githubScraping.fetchTrendingRepos(timeMode)
  // your personal GitHub authToken
  const authToken: string = process.env.GITHUB_API_TOKEN
  // your personal OpenAI API Key
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY //you still need to define this token for the openAIApi.ts

  // check if any repos were actually found
  if (!trendingSplit) {
    console.log("Repos couldn't be scraped")
    process.exit()
  }

  trendingSplit.length / 2 < firstNRepos ? (firstNRepos = trendingSplit.length / 2) : null

  for (let i = 0; i < firstNRepos; i++) {
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

    console.log('-------------------------------------------------------')
    console.log(await github.getRepoInfo(query, 'Bearer ' + authToken))

    // TODO check if the repo has more than a 1k stars: repoInfo.stargazers.totalCount < 1000
    //tries to find the readme file -> TODO check if owner returns the correct value
    const readme: string = await githubScraping.fetchRepositoryReadme(owner, name)
    //  console.log(readme)

    //sumarrieses the readME but also checks if the readme is not empty
    if (readme == ' ') {
      console.log('Can not summarise project as no ReadMefile was found')
    } else {
      console.log('Eli5:')
      console.log(await eli5.getELI5FromReadMe(readme)) //prints summarised readme if one was found
    }
    console.log(owner)
    console.log(name)
    const categories = await github.getRepositoryTopics(owner, name, authToken)
    //Categorizes the project
    console.log('Categories:\n')
    //console.log(await eli5.categorizeProjectGeneral(categories, readme))
    console.log('\n')
    console.log('hackernewsstories:\n')

    //receives the scraped hackernews
    const commentsAndLinks = await hackernews.searchHackerNewsStories(name)

    if (commentsAndLinks != undefined) {
      if (commentsAndLinks == null) {
        console.log('no comments were found')
      } else {
        //summs them up for the sentiment
        console.log('sentiment and links:\n')
        console.log(await eli5.getHackernewsSentiment(commentsAndLinks.comments.join('\n')))
        console.log('\n')
        console.log(commentsAndLinks.linksToPosts)
      }
    }

    // get the star history of the repo
    console.log(await starHistory.getRepoStarRecords(owner + '/' + name, authToken, 10))

    // get the fork history of the repo
    console.log(await forkHistory.getRepoForkRecords(owner + '/' + name, authToken, 10))

    // get the issue history of the repo
    console.log(await issueHistory.getRepoIssueRecords(owner + '/' + name, authToken, 10))

    // get the contributor count of the repo
    console.log(await github.getContributorCount(owner, name, authToken))
  }
  // get the developers
  // console.log(scrape.fetchTrendingDevelopers(timeMode))
}

//void main('monthly', 30)

// start with the final tests

// githubScraping/fetchTrendingRepos
// returns empty on error but can't be regularly tested for
async function testFTR() {
  let check = true
  try {
    // daily
    const output: string[] = await githubScraping.fetchTrendingRepos('daily')
    if (output.length != 50) {
      check = false
    }
    // weekly
    const output2: string[] = await githubScraping.fetchTrendingRepos('weekly')
    if (output2.length != 50) {
      check = false
    }
    // monthly
    const output3: string[] = await githubScraping.fetchTrendingRepos('monthly')
    if (output3.length != 50) {
      check = false
    }
  } catch {
    check = false
  }
  if (!check) {
    console.log("fetchTrendingRepos method doesn't work properly")
  }
}

// githubScraping/fetchRepositoryReadme
async function testFRR() {
  let check = true
  // test with wrong input
  const output = await githubScraping.fetchRepositoryReadme('xxxx', 'xxxx')
  if (output != ' ') {
    check = false
  }
  // test with correct output
  const output2 = await githubScraping.fetchRepositoryReadme('facebook', 'react')
  if (output2.length <= 1) {
    check = false
  }
  // test with both empty
  const output3 = await githubScraping.fetchRepositoryReadme('', '')
  if (output3 != ' ') {
    check = false
  }
  // test with owner empty
  const output4 = await githubScraping.fetchRepositoryReadme('', '')
  if (output4 != ' ') {
    check = false
  }
  // test with name empty
  const output5 = await githubScraping.fetchRepositoryReadme('', '')
  if (output5 != ' ') {
    check = false
  }
  if (!check) {
    console.log("fetchRepositoryReadme method doesn't work")
  }
}

// githubScraping/fetchTrendingDevelopers
// returns empty on error but can't be regularly tested for
async function testFTD() {
  let check = true
  try {
    // daily
    const output = await githubScraping.fetchTrendingDevelopers('daily')
    if (output.length != 25) {
      check = false
    }
    // weekly
    const output2 = await githubScraping.fetchTrendingDevelopers('weekly')
    if (output2.length != 25) {
      check = false
    }
    // monthly
    const output3 = await githubScraping.fetchTrendingDevelopers('monthly')
    if (output3.length != 25) {
      check = false
    }
  } catch {
    check = false
  }
  if (!check) {
    console.log("fetchTrendingDevelopers method doesn't work properly")
  }
}

void testFTR()
void testFRR()
void testFTD()

// starHistory/getRepoStargazersCount
// cannot be tested because the method is not being exported
// returns 0 on error

const facebookReactURL = 'facebook/react'

// starHistory/getRepoStarRecords
async function testRSR() {
  let check = true
  // check with false token => should return empty array
  const output = await starHistory.getRepoStarRecords(facebookReactURL, '', 10)
  if (output.length != 0) {
    check = false
  }
  // check for wrong repo
  const output2 = await starHistory.getRepoStarRecords('', process.env.GITHUB_API_TOKEN, 10)
  if (output2.length != 0) {
    check = false
  }
  // check for too high maxRequestAmount
  const output3 = await starHistory.getRepoStarRecords(
    facebookReactURL,
    process.env.GITHUB_API_TOKEN,
    1000
  )
  if (output3.length != 0) {
    check = false
  }
  // check for too low maxRequestAmount
  const output4 = await starHistory.getRepoStarRecords(
    facebookReactURL,
    process.env.GITHUB_API_TOKEN,
    0
  )
  if (output4.length != 0) {
    check = false
  }
  if (!check) {
    console.log("getRepoStarRecords method doesn't work properly")
  }
}

// the same tests also apply for forkHistory and issueHistory

// forkHistory/getRepoForksCount
// cannot be tested because the method is not being exported
// returns 0 on error

// forkHistory/getRepoForkRecords
async function testRFR() {
  let check = true
  // check with false token => should return empty array
  const output = await forkHistory.getRepoForkRecords(facebookReactURL, '', 10)
  if (output.length != 0) {
    check = false
  }
  // check for wrong repo
  const output2 = await forkHistory.getRepoForkRecords('', process.env.GITHUB_API_TOKEN, 10)
  if (output2.length != 0) {
    check = false
  }
  // check for too high maxRequestAmount
  const output3 = await forkHistory.getRepoForkRecords(
    facebookReactURL,
    process.env.GITHUB_API_TOKEN,
    1000
  )
  if (output3.length != 0) {
    check = false
  }
  // check for too low maxRequestAmount
  const output4 = await forkHistory.getRepoForkRecords(
    facebookReactURL,
    process.env.GITHUB_API_TOKEN,
    0
  )
  if (output4.length != 0) {
    check = false
  }
  if (!check) {
    console.log("getRepoForkRecords method doesn't work properly")
  }
}

// issueHistory/getRepoIssuesCount
// cannot be tested because the method is not being exported
// returns 0 on error

// issueHistory/getRepoIssueRecords
async function testRIR() {
  let check = true
  // check with false token => should return empty array
  const output = await issueHistory.getRepoIssueRecords(facebookReactURL, '', 10)
  if (output.length != 0) {
    check = false
  }
  // check for wrong repo
  const output2 = await issueHistory.getRepoIssueRecords('', process.env.GITHUB_API_TOKEN, 10)
  if (output2.length != 0) {
    check = false
  }
  // check for too high maxRequestAmount
  const output3 = await issueHistory.getRepoIssueRecords(
    facebookReactURL,
    process.env.GITHUB_API_TOKEN,
    1000
  )
  if (output3.length != 0) {
    check = false
  }
  // check for too low maxRequestAmount
  const output4 = await issueHistory.getRepoIssueRecords(
    facebookReactURL,
    process.env.GITHUB_API_TOKEN,
    0
  )
  if (output4.length != 0) {
    check = false
  }
  if (!check) {
    console.log("getRepoIssueRecords method doesn't work properly")
  }
}

void testRSR()
void testRFR()
void testRIR()

// utils/range

function testRange() {
  let check = true

  // Test cases for the range function
  const rangeResult = utils.range(1, 5)
  if (
    !Array.isArray(rangeResult) ||
    rangeResult.length !== 5 ||
    !rangeResult.every((num) => Number.isInteger(num))
  ) {
    check = false
  }
  const result = [1, 2, 3, 4, 5]
  if (JSON.stringify(rangeResult) != JSON.stringify(result)) {
    check = false
  }
  // test when value is negative
  const rangeResult2 = utils.range(-1, 5)
  if (
    !Array.isArray(rangeResult2) ||
    rangeResult2.length !== 7 ||
    !rangeResult2.every((num) => Number.isInteger(num))
  ) {
    check = false
  }
  const result2 = [-1, 0, 1, 2, 3, 4, 5]
  if (JSON.stringify(rangeResult2) != JSON.stringify(result2)) {
    check = false
  }
  // test when values are equal
  const rangeResult3 = utils.range(1, 1)
  if (rangeResult3.length !== 1) {
    check = false
  }
  // test when from is larger than to
  const rangeResult4 = utils.range(3, 1)
  if (rangeResult4.length !== 0) {
    check = false
  }
  if (!check) {
    console.log("range method doesn't work properly")
  }
}

// utils/getTimeStampByDate and utils/getDateString are just generic helper functions

// the last three helper methods have been are never being called directly but just by other functions
// predetermined inputs mitigate error risk
// they also include try catch statements and 0 checkers to avoid any internal errors

void testRange()

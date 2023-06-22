import { getRepositoryTopics, getContributorCount } from '../api/githubApi'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function testGetRepositoryTopics(githubToken: string) {
  // Case: No topics
  console.log('Case: No topics')
  const noTopicsResponse = await getRepositoryTopics('AntonOsika', 'gpt-engineer', githubToken)
  console.log(noTopicsResponse === null ? 'Pass' : 'Fail') // Logs whether the response is null (Pass) or not null (Fail)

  // Case: Topics in another language
  console.log('Case: Topics in another language')
  const otherLanguageResponse = await getRepositoryTopics(
    'HqWu-HITCS',
    'Awesome-Chinese-LLM',
    githubToken
  )
  const expectedOtherLanguageTopics = ['llm', 'nlp', 'chatglm', 'chinese', 'llama', 'awesome-lists']
  console.log(
    JSON.stringify(otherLanguageResponse) === JSON.stringify(expectedOtherLanguageTopics)
      ? 'Pass'
      : 'Fail'
  ) // Logs whether the response matches the expected topics (Pass) or not (Fail)

  // Case: Repo does not exist
  console.log('Case: Repo does not exist')
  const nonExistentRepoResponse = await getRepositoryTopics('no', 'repo', githubToken)
  console.log(nonExistentRepoResponse === null ? 'Pass' : 'Fail') // Logs whether the response is null (Pass) or not null (Fail)

  // Case: Many categories
  console.log('Case: Many categories')
  const manyCategoriesResponse = await getRepositoryTopics(
    'AI4Finance-Foundation',
    'FinGPT',
    githubToken
  )
  const expectedManyCategories = [
    'chatgpt',
    'finance',
    'fintech',
    'large-language-models',
    'machine-learning',
    'nlp',
    'prompt-engineering',
    'pytorch',
    'reinforcement-learning',
    'robo-advisor',
    'sentiment-analysis',
    'technical-analysis',
    'fingpt'
  ]
  console.log(
    JSON.stringify(manyCategoriesResponse) === JSON.stringify(expectedManyCategories)
      ? 'Pass'
      : 'Fail'
  ) // Logs whether the response matches the expected categories (Pass) or not (Fail)

  // Case: Empty string parameters
  console.log('Case: Empty string parameters')
  const emptyParamsResponse = await getRepositoryTopics('', '', githubToken)
  console.log(emptyParamsResponse === null ? 'Pass' : 'Fail') // Logs whether the response is null (Pass) or not null (Fail)
}

//test function that calls the method and prints out all contributors
// eslint-disable-next-line @typescript-eslint/require-await
async function calculatePercentageDifference(expected: number, actual: number) {
  const diff = Math.abs(actual - expected)
  const percentageDiff = (diff / expected) * 100
  return percentageDiff.toFixed(2)
}

export async function testGetContributorCount(githubToken: string) {
  console.log('Case: Many contributors')
  console.log('Expected:', 311)
  const actualManyContributors = await getContributorCount('desktop', 'desktop', githubToken)
  console.log('Actual:', actualManyContributors)
  console.log('Diff:', await calculatePercentageDifference(311, actualManyContributors))

  console.log('Case: Few contributors')
  console.log('Expected:', 20)
  const actualFewContributors = await getContributorCount(
    'microsoft',
    'AI-For-Beginners',
    githubToken
  )
  console.log('Actual:', actualFewContributors)
  console.log('Diff:', await calculatePercentageDifference(20, actualFewContributors))

  console.log('Case: 7 contributors')
  console.log('Expected:', 7)
  const actualSevenContributors = await getContributorCount('Zeqiang-Lai', 'DragGAN', githubToken)
  console.log('Actual:', actualSevenContributors)
  console.log('Diff:', await calculatePercentageDifference(7, actualSevenContributors))

  console.log('Case: 143 contributors')
  console.log('Expected:', 143)
  const actualOneFortyThreeContributors = await getContributorCount(
    'geohot',
    'tinygrad',
    githubToken
  )
  console.log('Actual:', actualOneFortyThreeContributors)
  console.log('Diff:', await calculatePercentageDifference(143, actualOneFortyThreeContributors))

  console.log('Case: 1623 contributors')
  console.log('Expected:', 1623)
  const actualOneSixTwoThreeContributors = await getContributorCount(
    'facebook',
    'react',
    githubToken
  )
  console.log('Actual:', actualOneSixTwoThreeContributors)
  console.log('Diff:', await calculatePercentageDifference(1623, actualOneSixTwoThreeContributors))

  console.log('Case: 63 contributors')
  console.log('Expected:', 63)
  const actualSixtyThreeContributors = await getContributorCount(
    'spacedriveapp',
    'spacedrive',
    githubToken
  )
  console.log('Actual:', actualSixtyThreeContributors)
  console.log('Diff:', await calculatePercentageDifference(63, actualSixtyThreeContributors))

  console.log('Case: 22 contributors')
  console.log('Expected:', 22)
  const actualTwentyTwoContributors = await getContributorCount(
    'iam-abbas',
    'Reddit-Stock-Trends',
    githubToken
  )
  console.log('Actual:', actualTwentyTwoContributors)
  console.log('Diff:', await calculatePercentageDifference(22, actualTwentyTwoContributors))

  console.log('Case: 75 contributors')
  console.log('Expected:', 75)
  const actualSeventyFiveContributors = await getContributorCount(
    'GeneralMills',
    'pytrends',
    githubToken
  )
  console.log('Actual:', actualSeventyFiveContributors)
  console.log('Diff:', await calculatePercentageDifference(75, actualSeventyFiveContributors))

  console.log('Case: 3 contributors')
  console.log('Expected:', 3)
  const actualThreeContributors = await getContributorCount(
    'vitalets',
    'github-trending-repos',
    githubToken
  )
  console.log('Actual:', actualThreeContributors)
  console.log('Diff:', await calculatePercentageDifference(3, actualThreeContributors))

  console.log('Case: 0 contributors')
  console.log('Expected:', 0)
  const actualZeroContributors = await getContributorCount(
    'mbadry1',
    'Trending-Deep-Learning',
    githubToken
  )
  console.log('Actual:', actualZeroContributors)
  console.log('Diff:', await calculatePercentageDifference(0, actualZeroContributors))

  console.log('Case: 17 contributors')
  console.log('Expected:', 17)
  const actualSeventeenContributors = await getContributorCount('QasimWani', 'LeetHub', githubToken)
  console.log('Actual:', actualSeventeenContributors)
  console.log('Diff:', await calculatePercentageDifference(17, actualSeventeenContributors))

  console.log('Case: 0 contributors')
  console.log('Expected:', 0)
  const actualZeroContributors2 = await getContributorCount(
    'datawrangling',
    'trendingtopics',
    githubToken
  )
  console.log('Actual:', actualZeroContributors2)
  console.log('Diff:', await calculatePercentageDifference(0, actualZeroContributors2))

  console.log('Case: Many contributors')
  console.log('Expected:', 4725)
  const actualManyContributors2 = await getContributorCount(
    'freeCodeCamp',
    'freeCodeCamp',
    githubToken
  )
  console.log('Actual:', actualManyContributors2)
  console.log('Diff:', await calculatePercentageDifference(4725, actualManyContributors2))

  console.log('Case: Few contributors')
  console.log('Expected:', 2515)
  const actualFewContributors2 = await getContributorCount(
    'EbookFoundation',
    'free-programming-books',
    githubToken
  )
  console.log('Actual:', actualFewContributors2)
  console.log('Diff:', await calculatePercentageDifference(2515, actualFewContributors2))

  console.log('Case: 290 contributors')
  console.log('Expected:', 290)
  const actualTwoNineZeroContributors = await getContributorCount(
    'jwasham',
    'coding-interview-university',
    githubToken
  )
  console.log('Actual:', actualTwoNineZeroContributors)
  console.log('Diff:', await calculatePercentageDifference(290, actualTwoNineZeroContributors))

  console.log('Case: 565 contributors')
  console.log('Expected:', 565)
  const actualFiveSixFiveContributors = await getContributorCount(
    'sindresorhus',
    'awesome',
    githubToken
  )
  console.log('Actual:', actualFiveSixFiveContributors)
  console.log('Diff:', await calculatePercentageDifference(565, actualFiveSixFiveContributors))

  console.log('Case: 630 contributors')
  console.log('Expected:', 620)
  const actualSixThreeZeroContributors = await getContributorCount(
    'kamranahmedse',
    'developer-roadmap',
    githubToken
  )
  console.log('Actual:', actualSixThreeZeroContributors)
  console.log('Diff:', await calculatePercentageDifference(620, actualSixThreeZeroContributors))
}

void testGetContributorCount('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')

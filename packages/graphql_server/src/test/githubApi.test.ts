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
export async function testGetContributorCount(githubToken: string) {
  console.log('Case: Many contributors')
  console.log('Expected:', 311)
  console.log('Actual:', await getContributorCount('desktop', 'desktop', githubToken))

  console.log('Case: Few contributors')
  console.log('Expected:', 20)
  console.log('Actual:', await getContributorCount('microsoft', 'AI-For-Beginners', githubToken))

  console.log('Case: 7 contributors')
  console.log('Expected:', 7)
  console.log('Actual:', await getContributorCount('Zeqiang-Lai', 'DragGAN', githubToken))

  console.log('Case: 143 contributors')
  console.log('Expected:', 143)
  console.log('Actual:', await getContributorCount('geohot', 'tinygrad', githubToken))

  console.log('Case: 1623 contributors')
  console.log('Expected:', 1623)
  console.log('Actual:', await getContributorCount('facebook', 'react', githubToken))

  console.log('Case: 63 contributors')
  console.log('Expected:', 63)
  console.log('Actual:', await getContributorCount('spacedriveapp', 'spacedrive', githubToken))

  console.log('Case: 22 contributors')
  console.log('Expected:', 22)
  console.log('Actual:', await getContributorCount('iam-abbas', 'Reddit-Stock-Trends', githubToken))

  console.log('Case: 75 contributors')
  console.log('Expected:', 75)
  console.log('Actual:', await getContributorCount('GeneralMills', 'pytrends', githubToken))

  console.log('Case: 3 contributors')
  console.log('Expected:', 3)
  console.log(
    'Actual:',
    await getContributorCount('vitalets', 'github-trending-repos', githubToken)
  )
  console.log('Case: 0 contributors')
  console.log('Expected:', 0)
  console.log(
    'Actual:',
    await getContributorCount('mbadry1', 'Trending-Deep-Learning', githubToken)
  )

  console.log('Case: 17 contributors')
  console.log('Expected:', 17)
  console.log('Actual:', await getContributorCount('QasimWani', 'LeetHub', githubToken))

  console.log('Case: 0 contributors')
  console.log('Expected:', 0)
  console.log('Actual:', await getContributorCount('datawrangling', 'trendingtopics', githubToken))
}

void testGetContributorCount('token')

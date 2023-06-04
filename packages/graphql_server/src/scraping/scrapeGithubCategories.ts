import axios, { AxiosResponse } from 'axios'
import { RepositoryTopicsResponse } from '../../types/githubApi'

/**
 * Retrieves the repository topics from GitHub API for the specified repository.
 * @param repositoryOwner - The owner of the repository.
 * @param repositoryName - The name of the repository.
 * @returns A Promise that resolves to a string representing the repository topics.
 * @throws Error if the repository topics cannot be retrieved.
 */
async function getRepositoryTopics(
  repositoryOwner: string,
  repositoryName: string
): Promise<string> {
  const apiUrl = 'https://api.github.com/graphql'
  const token = process.env.GITHUB_API_TOKEN //process.env.GITHUB_API_TOKEN

  const query = `
    query {
      repository(owner: "${repositoryOwner}", name: "${repositoryName}") {
        repositoryTopics(first: 10) {
          nodes {
            topic {
              name
            }
          }
        }
      }
    }
  `

  const headers = {
    Authorization: `Bearer ${token}`
  }

  try {
    const response: AxiosResponse<RepositoryTopicsResponse> = await axios.post(
      apiUrl,
      { query },
      { headers }
    )
    const data = response?.data?.data?.repository
    if (data.repositoryTopics.nodes.length > 0) {
      const topics: string[] = data.repositoryTopics.nodes.map(
        (node: { topic: { name: string } }) => node.topic.name
      )
      return topics.join(' ') //return the openai response as a string
    } else {
      throw new Error('No repository topics found.')
    }
  } catch (error) {
    console.log('Could not retrieve the categories')
    throw new Error('Failed to get repository topics.')
  }
}

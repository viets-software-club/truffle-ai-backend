import axios, { AxiosResponse } from 'axios'
import {
  GitHubOrganization,
  GitHubUser,
  GitHubInfo,
  Edge,
  ContributorResponse,
  RepositoryTopicsResponse
} from '../../types/githubApi'

const githubApiUrl = 'https://api.github.com/graphql'

/** Gets the repo's information via GitHub's GraphQL API
 * @param {string} query GraphQL query for the repo (including owner and name)
 * @param {string} authToken personal authorization token
 * @returns {any[]} the json data for the requested repo as by the graphql query
 */
export async function getRepoInfo(query: string, authToken: string): Promise<GitHubInfo | null> {
  const response: AxiosResponse<{ data: { repository: GitHubInfo } }> = await axios.post(
    githubApiUrl,
    {
      query
    },
    {
      headers: {
        Authorization: authToken
      }
    }
  )
  return response.data.data.repository
}

/** Gets a organizations information via GitHub's GraphQL API
 * @param {string} query GraphQL query for the organization (including owner and name)
 * @param {string} authToken personal authorization token
 * @returns {any[]} the json data for the requested organization as by the graphql query; null on error
 */
export async function getOrganizationInfo(
  query: string,
  authToken: string
): Promise<GitHubOrganization | null> {
  const response: AxiosResponse<{ data: { organization: GitHubOrganization } }> = await axios.post(
    githubApiUrl,
    {
      query: query
    },
    {
      headers: {
        Authorization: authToken
      }
    }
  )
  return response.data.data.organization
}

/** Gets a persons information via GitHub's GraphQL API
 * @param {string} query GraphQL query for the person (including owner and name)
 * @param {string} authToken personal authorization token
 * @returns {any[]} the json data for the requested person as by the graphql query; null on error
 */
export async function getUserInfo(query: string, authToken: string): Promise<GitHubUser | null> {
  const response: AxiosResponse<{ data: { user: GitHubUser } }> = await axios.post(
    githubApiUrl,
    {
      query: query
    },
    {
      headers: {
        Authorization: authToken
      }
    }
  )
  return response.data.data.user
}

/** Retrieves the contributor count for a GitHub repository.
 * This may be smaller than the count on the Github page because only contributors that
 * committed into the main branch are being counted
 * @param owner - The owner of the GitHub repository.
 * @param repo - The name of the GitHub repository.
 * @param authToken - Github API token
 * @returns A Promise that resolves to the total unique contributor count
 */
export async function getContributorCount(
  owner: string,
  repo: string,
  authToken: string
): Promise<number> {
  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        defaultBranchRef {
          target {
            ... on Commit {
              history {
                totalCount
                edges {
                  node {
                    author {
                      user {
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const variables = {
    owner,
    repo
  }

  const response: AxiosResponse<ContributorResponse> = await axios.post(
    githubApiUrl,
    { query, variables },
    {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }
  )

  const contributors: string[] =
    response.data.data.repository.defaultBranchRef.target.history.edges.map(
      (edge: Edge) => edge.node.author?.user?.login
    )
  const uniqueContributors = Array.from(new Set(contributors))

  return uniqueContributors.length
}

/**
 * Retrieves the repository topics from GitHub API for the specified repository.
 * @param repositoryOwner - The owner of the repository.
 * @param repositoryName - The name of the repository.
 * @returns A Promise that resolves to a string representing the repository topics.
 * @throws Error if the repository topics cannot be retrieved.
 * //returns topics defined by the founder
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getRepositoryTopics(
  repositoryOwner: string, //these need to be passed as parameter
  repositoryName: string,
  tokenGithub: string
) {
  const apiUrl = 'https://api.github.com/graphql'

  const query = `
    query {
      repository(owner: "${repositoryOwner}", name: "${repositoryName}") {
        repositoryTopics(first: 15) {
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
    Authorization: `Bearer ${tokenGithub}`
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
    return ' '
  }
}

import axios from 'axios'

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
  const token = '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'

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
    const response = await axios.post(apiUrl, { query }, { headers })
    const data = response?.data?.data?.repository //here I still need the correct type!!!
    if (data.repositoryTopics.nodes.length > 0) {
      const topics: string[] = data.repositoryTopics.nodes.map(
        (node: { topic: { name: string } }) => node.topic.name
      )
      console.log(topics.join(', '))
      return topics.join(' ')
    } else {
      throw new Error('No repository topics found.')
    }
  } catch (error) {
    console.log('Could not retrieve the categories')
    throw new Error('Failed to get repository topics.')
  }
}

void getRepositoryTopics('chinese-poetry', 'chinese-poetry')

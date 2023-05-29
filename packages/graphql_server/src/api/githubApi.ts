import axios, { AxiosResponse } from 'axios'
import dotenv from 'dotenv'

dotenv.config()

type ProjectFounder = {
  name: string
  login: string
  twitterUsername: string
}

type GitHubCommitHistory = {
  defaultBranchRef: {
    target: {
      history: {
        edges: {
          node: {
            author: {
              user: {
                name: string
                login: string
                twitterUsername: string
              }
            }
          }
        }[]
      }
    }
  }
}

/**
 * Returns a Array of Founders with their names, login names and twitter handles. This method goes trough the commit history of a specific repo
 * and fetches teh first 5 commits, which are most likley the initiators of a project. It then removes duplicates, because several commits can be from the
 * same person, but shouldn't be returned within the Array
 * @param owner: name of the owner of the github repo
 * @param name: name of the github repo
 * @returns An Array of the project founders
 */
export async function getRepoFounders(owner: string, name: string): Promise<ProjectFounder[]> {
  const query = `query {
        repository(owner: "${owner}", name: "${name}") {
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 5) {
                  edges {
                    node {
                      author {
                        user {
                          name
                          login
                          twitterUsername
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`
      
  // Building the AxiosRequest and initiate the post request
  const authToken = 'Bearer ' + (process.env.GITHUB_API_TOKEN || '')
  const response: AxiosResponse<{ data: { repository: GitHubCommitHistory } }> = await axios.post(
    'https://api.github.com/graphql',
    {
      query
    },
    {
      headers: {
        Authorization: authToken
      }
    }
  )

  const distinctCommiters: ProjectFounder[] = []

  // checks, whether a login name appears twice and only pushes distinct founders into the array
  response.data.data.repository.defaultBranchRef.target.history.edges.forEach((node) => {
    const loginName = node.node.author.user.login
    if (!distinctCommiters.find((c) => c.login === loginName)) {
      distinctCommiters.push({
        name: node.node.author.user.name ?? '',
        login: node.node.author.user.login ?? '',
        twitterUsername: node.node.author.user.twitterUsername ?? ''
      })
    }
  })

  return distinctCommiters
}

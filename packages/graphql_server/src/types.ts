export type Developer = {
  name: string
  username: string
}

export type DeveloperRepo = {
  username: string
  repo: string
}

export type Repository = {
  [key: string]: any
}

export type OpenAIResponse = {
  choices: {
    message: {
      content: string
    }
  }[]
}

export type StargazersData = {
  length: number
  headers: {
    link?: string
  }
  status: number
  starred_at: string
}

export type StarRecord = {
  date: string
  count: number
}

export type timeMode = 'daily' | 'weekly' | 'monthly'

// Github info type as returned by GraphQL API
export type GitHubInfo = {
  name: string
  description: string
  stargazerCount: number
  issues: { totalCount: number }
  forkCount: number
  pullRequests: { totalCount: number }
  url: string
  homepageUrl: string
}

// Github organization info type as returned by GraphQL API
export type GitHubOrganization = {
  name: string
  login: string
  avatarUrl: string
  repositories: { totalCount: number }
  email: string
  websiteUrl: string
  twitterUsername: string
  url: string
}

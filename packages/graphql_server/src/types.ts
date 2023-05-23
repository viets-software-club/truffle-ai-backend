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

// query {
//   repository(owner: "${owner}", name: "${name}") {
//     name
//     description
//     stargazerCount
//     issues(filterBy: {states: [OPEN]}) {totalCount}
//     forkCount
//     pullRequests(states: [OPEN]) {totalCount}
//     url
//     homepageUrl
//   owner {
//     login
//   }
// }
// }

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

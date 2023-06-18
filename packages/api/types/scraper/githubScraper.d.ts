type Developer = {
  name: string
  username: string
}

type DeveloperRepo = {
  username: string
  repo: string
}

type Contributor = {
  login: string
  contributions: number
}

type timeMode = 'daily' | 'weekly' | 'monthly'

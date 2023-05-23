import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'
import { fetchRepos, getRepoInfo } from './ScrapeRepos'
import { GitHubInfo } from './types'

// type Repository = Pick<Database['public']['Tables']['project']['Row'], 'name' | 'owned_by'>
type RepositoryInsertion = Database['public']['Tables']['project']['Insert']

const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)

const dbUpdater = async () => {
  // delete all projects that are not bookmarked and older than 23 hours and 50 minutes
  const { error: deletionError } = await supabase
    .from('project')
    .delete()
    .eq('is_bookmarked', false)
    .lt('created_at', getCutOffTime(23, 50))

  // get all projects that remain in the database
  const { data: existingRepos, error: error2 } = await supabase
    .from('project')
    .select('name, owned_by')

  const { data: organizations, error: error3 } = await supabase
    .from('organization')
    .select('id, name')

  // update all remaining projects
  if (existingRepos) {
    for (const repo of existingRepos) {
      const orgName: string = organizations?.filter((org) => org.id === repo.owned_by)[0]
        .name as string
      updateRepo(repo.name, orgName)
    }
  }

  // get trending repos from github
  const trendingRepos = await fetchRepos(0)
  console.log(trendingRepos)
  const reposToBeAdded: RepositoryInsertion[] = []

  // go through the trending repos
  for (let i = 0; i < 3; i++) {
    const owner = trendingRepos[2 * i]
    const name = trendingRepos[2 * i + 1]
    // check if the repo is already in the database
    const { data: currentRepo, error: error4 } = await supabase
      .from('project')
      .select('id')
      .eq('name', name)
      .eq('owned_by ( name )', owner)
    if (currentRepo) {
      continue
    }

    // aggregate all the data for the repo and push it to the repos to be added
    await aggregateDataForRepo(name, owner)
      .then((res) => res !== null && reposToBeAdded.push(res))
      .catch((err) => console.log(err))
  }

  const { error: insertionError } = await supabase.from('project').insert(reposToBeAdded)
  console.log(insertionError)
  console.log(reposToBeAdded)
}

const aggregateDataForRepo = async (name: string, owner: string) => {
  const query = `query {
    repository(owner: "${owner}", name: "${name}") {
      name 
      description
      stargazerCount
      issues(filterBy: {states: [OPEN]}) {totalCount}
      forkCount
      pullRequests(states: [OPEN]) {totalCount}
      url
      homepageUrl
    owner {
      login
    }
  }
  }`

  // getRepoInfo(query, 'Bearer ' + )
  const repoGHdata: GitHubInfo | null = await getRepoInfo(
    query,
    'Bearer ' + process.env.GITHUB_API_TOKEN
  )
  // console.log({
  //   name: res.name,
  //   about: res.description,
  //   star_count: res.stargazerCount,
  //   issue_count: res.issues.totalCount,
  //   fork_count: res.forkCount,
  //   pull_request_count: res.pullRequests.totalCount,
  //   contributor_count: 1,
  //   github_url: res.url,
  //   website_url: res.homepageUrl,
  //   owned_by: '1',
  //   is_bookmarked: false
  // })

  if (repoGHdata === null) {
    return null
  }

  return {
    name: repoGHdata.name,
    about: repoGHdata.description,
    star_count: repoGHdata.stargazerCount,
    issue_count: repoGHdata.issues.totalCount,
    fork_count: repoGHdata.forkCount,
    pull_request_count: repoGHdata.pullRequests.totalCount,
    contributor_count: 1,
    github_url: repoGHdata.url,
    website_url: repoGHdata.homepageUrl,
    owned_by: '38152f14-85c8-453b-a7f6-48daf69ff3bc',
    is_bookmarked: false
  }
}

// {
//   name: 'DragGAN',
//   description: 'Unofficial implementation of "Drag Your GAN: Interactive Point-based Manipulation on the Generative Image Manifold"',
//   stargazerCount: 425,
//   issues: { totalCount: 23 },
//   forkCount: 49,
//   pullRequests: { totalCount: 0 },
//   url: 'https://github.com/Zeqiang-Lai/DragGAN',
//   homepageUrl: '',
//   owner: { login: 'Zeqiang-Lai' }
// }

// Insert: {
//   about?: string | null
//   contributor_count?: string | null
//   created_at?: string | null
//   eli5?: string | null
//   fork_count?: string | null
//   github_url?: string | null
//   id?: string
//   is_bookmarked?: boolean | null
//   issue_count?: string | null
//   name: string
//   owned_by: string
//   pull_request_count?: string | null
//   star_count?: string | null
//   star_history?: number[] | null
//   website_url?: string | null
// }

const getCutOffTime: (hours: number, minutes: number) => string = (
  hours: number,
  minutes: number
) => {
  const cutoffTime = new Date()
  cutoffTime.setHours(cutoffTime.getHours() - hours)
  cutoffTime.setMinutes(cutoffTime.getMinutes() - minutes)
  return cutoffTime.toISOString()
}

// daily: gh + twitter
// weekly: rest
const updateRepo = (name: string, owner: string) => {
  return null
}

const getTrendingRepos = () => {
  return
}

void dbUpdater()

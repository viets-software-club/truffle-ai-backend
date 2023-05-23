import { Database } from '../types/supabase'
import { fetchRepos, getOrganizationInfo, getRepoInfo } from './ScrapeRepos'
import { formatAndEnrich } from './formatAndEnrich'
import supabase from './supabase'

// type Repository = Pick<Database['public']['Tables']['project']['Row'], 'name' | 'owned_by'>
export type ProjectInsertion = Database['public']['Tables']['project']['Insert']
export type OrganizationInsertion = Database['public']['Tables']['organization']['Insert']

const dbUpdater = async () => {
  // delete all projects that are not bookmarked and older than 23 hours and 50 minutes
  // deleteOldProjects()
  const { error: deletionError } = await supabase
    .from('project')
    .delete()
    .eq('is_bookmarked', false)
    .lt('created_at', getCutOffTime(23, 50))

  // getAllProjects()
  // get all projects that remain in the database
  const { data: existingRepos, error: error2 } = await supabase
    .from('project')
    .select('name, owned_by')

  // getAllOrganizations()
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

  // enrich them with all data that is gathered
  // format them so they can be stored in the db
  await formatAndEnrich(trendingRepos)

  // const { error: insertionError } = await supabase.from('project').insert(reposToBeAdded)
  // console.log(insertionError)
}

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
// @TODO: imlement
const updateRepo = (name: string, owner: string) => {
  return null
}

void dbUpdater()

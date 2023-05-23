import supabase from './supabase'
import { aggregateDataForRepo } from './dataAggregation'
import { getOrganizationInfo, getRepoInfo } from './ScrapeRepos'
import { GitHubOrganization } from './types'
import { OrganizationInsertion, ProjectInsertion } from './dbUpdater'

export const formatAndEnrich = async (trendingRepos: string[]) => {
  const reposToBeAdded: ProjectInsertion[] = []

  // go through the trending repos
  for (let i = 0; i < trendingRepos.length / 2; i++) {
    const owner = trendingRepos[2 * i]
    const name = trendingRepos[2 * i + 1]
    // check if the repo is already in the database
    const { data: currentRepo, error: error4 } = await supabase
      .from('project')
      .select('id')
      .eq('name', name)
      .eq('owned_by ( name )', owner)
    // if it is in the database nothing has to be done with this repo
    if (currentRepo) {
      continue
    }

    // aggregate all the data for the repo
    const repoInfo: ProjectInsertion | null = await aggregateDataForRepo(name, owner)

    // insert the repo into the database
    if (repoInfo) {
      const { error: insertionError } = await supabase.from('project').insert([repoInfo])
      console.log(insertionError)
    }
  }
  return reposToBeAdded
}

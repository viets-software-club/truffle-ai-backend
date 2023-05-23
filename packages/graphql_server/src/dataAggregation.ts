import { GitHubOrganization, GitHubInfo } from './types'
import { getOrganizationInfo, getRepoInfo } from './ScrapeRepos'
import { OrganizationInsertion, ProjectInsertion } from './dbUpdater'
import supabase from './supabase'

export const aggregateDataForRepo = async (name: string, owner: string) => {
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
  const repoGHdata: GitHubInfo | null = await getRepoInfo(query, 'Bearer ' + 'api key XXXXXXXXXXXX')

  if (repoGHdata === null) {
    return null
  }

  const organizationID = await getOrganizationID(owner)

  // @Todo aggregate more data for the repo

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
    owned_by: organizationID ?? '634b6eb5-30c8-4818-81d3-e1d98cb0b2c7',
    is_bookmarked: false
  }
}

const getOrganizationID = async (owner: string) => {
  const { data, error } = await supabase.from('organization').select('id').eq('name', owner)

  if (data && data[0]) {
    return data[0].id
  }

  const query = `query {
      organization(login: "${owner}") {
        login
        name
        avatarUrl
        repositories {totalCount}
        email
        websiteUrl
        twitterUsername
        url
    }
    }`

  const organizationInfo: GitHubOrganization | null = await getOrganizationInfo(
    query,
    'Bearer ' + 'api key XXXXXXXXXXXx'
  )
  if (organizationInfo !== null) {
    const organizationDataDBFormat: OrganizationInsertion = {
      name: organizationInfo.name,
      login: organizationInfo.login,
      avatar_url: organizationInfo.avatarUrl,
      repository_count: organizationInfo.repositories.totalCount,
      email: organizationInfo.email,
      website_url: organizationInfo.websiteUrl,
      twitter_username: organizationInfo.twitterUsername,
      github_url: organizationInfo.url
    }

    const { data: data2, error: error2 } = await supabase
      .from('organization')
      .insert([organizationDataDBFormat])

    const { data: orga, error: error3 } = await supabase
      .from('organization')
      .select('id')
      .eq('name', owner)

    if (orga && orga[0]) {
      return orga[0].id
    }
  }
}

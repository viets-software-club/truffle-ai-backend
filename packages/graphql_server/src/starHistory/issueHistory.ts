import axios, { AxiosResponse } from 'axios'
import { IssueRecord, IssueData } from './types'
import * as utils from './utils'

const DEFAULT_PER_PAGE = 30

/** This method retrieves the issues from a page of a GitHub repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github Access token
 * @param {number} page - Page Number of the issues to retrieve
 * @returns Promise<Object>: A promise that resolves to the issues of the repository
 */
async function getRepoIssues(
  repo: string,
  token?: string,
  page?: number
): Promise<AxiosResponse<IssueData[]>> {
  let url = `https://api.github.com/repos/${repo}/issues?per_page=${DEFAULT_PER_PAGE}&sort=created&direction=asc`

  if (page !== undefined) {
    url = `${url}&page=${page}`
  }
  return axios.get(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: token ? `token ${token}` : ''
    }
  })
}

/** Retrieves the total count of issues for a Github repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github access token
 * @returns Promise<number> : A promise that resolves to the total count of issues for the repository
 */
async function getRepoIssuesCount(repo: string, token?: string): Promise<number> {
  const response: AxiosResponse<{ open_issues_count: number }> = await axios.get(
    `https://api.github.com/repos/${repo}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: token ? `token ${token}` : ''
      }
    }
  )

  return response?.data?.open_issues_count
}

/** Retrieves the issue records (issue count by date) of a Github repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github Access token
 * @param {number} maxRequestAmount - Maximum number of API requests to make to retrieve the issues
 * The higher this value is the more accurate is going to be the graph of the issue history
 * @returns Promise<Array<{ date: string, count: number }>>: A promise that resolves to an array of issue records
 */
export async function getRepoIssueRecords(repo: string, token: string, maxRequestAmount: number) {
  const patchRes: AxiosResponse<IssueData[]> = await getRepoIssues(repo, token)

  const headerLink: string = (patchRes.headers['link'] as string) || ''

  let pageCount = 1
  const regResult = /next.*&page=(\d*).*last/.exec(headerLink)

  if (regResult && regResult[1] && Number.isInteger(Number(regResult[1]))) {
    pageCount = Number(regResult[1])
  }

  if (pageCount === 1 && patchRes?.data?.length === 0) {
    throw {
      status: patchRes.status,
      data: []
    }
  }

  const requestPages: number[] = []
  if (pageCount < maxRequestAmount) {
    requestPages.push(...utils.range(1, pageCount))
  } else {
    utils.range(1, maxRequestAmount).forEach((i: number) => {
      requestPages.push(Math.round((i * pageCount) / maxRequestAmount) - 1)
    })
    if (!requestPages.includes(1)) {
      requestPages.unshift(1)
    }
  }
  return await getRepoIssuesMap(repo, token, requestPages, maxRequestAmount)
}

/** Retrieves the issue records (issue count by date) of a GitHub repository and returns them as an array of `IssuRecord` objects.
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - GitHub Access token for authentication (optional).
 * @param {number[]} requestPages - Array of page numbers to request from the API.
 * @param {number} maxRequestAmount - Maximum number of API requests to make to retrieve the issue records.
 * @returns {IssueRecord[]} - An array of `IssueRecord` objects representing the issue records.
 */
async function getRepoIssuesMap(
  repo: string,
  token: string,
  requestPages: number[],
  maxRequestAmount: number
) {
  // add the first page if not already in the array
  if (!requestPages.includes(1)) {
    requestPages.unshift(1)
  }

  const resArray = await Promise.all(
    requestPages.map((page) => {
      return getRepoIssues(repo, token, page)
    })
  )

  const issuesRecordsMap: Map<string, number> = new Map()

  if (requestPages.length < maxRequestAmount) {
    const issuesRecordsData: { created_at: string }[] = []
    resArray.forEach(({ data }) => {
      issuesRecordsData.push(...data)
    })
    for (let i = 0; i < issuesRecordsData.length; ) {
      issuesRecordsMap.set(utils.getDateString(issuesRecordsData[i].created_at), i + 1)
      i += Math.floor(issuesRecordsData.length / maxRequestAmount) || 1
    }
  } else {
    resArray.forEach(({ data }: { data: { created_at: string }[] }, index) => {
      if (data.length > 0) {
        const issuesRecord = data[0]
        issuesRecordsMap.set(
          utils.getDateString(issuesRecord.created_at),
          DEFAULT_PER_PAGE * (requestPages[index] - 1)
        )
      }
    })
  }

  const issuesAmount = await getRepoIssuesCount(repo, token)
  issuesRecordsMap.set(utils.getDateString(Date.now()), issuesAmount)

  const issuesRecords: IssueRecord[] = []

  issuesRecordsMap.forEach((v, k) => {
    issuesRecords.push({
      date: k,
      count: v
    })
  })

  return issuesRecords
}

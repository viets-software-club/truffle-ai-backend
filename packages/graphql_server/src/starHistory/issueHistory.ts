import axios, { AxiosResponse } from 'axios'
import { IssueRecord, IssueData, TimeFrame } from './types'
import * as utils from './utils'

const DEFAULT_PER_PAGE = 30

/** This method retrieves the issues from a page of a GitHub repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github Access token
 * @param {number} page - Page Number of the issues to retrieve
 * @param {string} direction - Determines in which order the pages will be: 'asc' | 'desc'
 * All the normal history functions should use 'asc', the partial history should use 'desc'
 * @returns Promise<Object>: A promise that resolves to the issues of the repository
 */
async function getRepoIssues(
  repo: string,
  token: string,
  page?: number,
  direction?: string
): Promise<AxiosResponse<IssueData[]>> {
  let url = `https://api.github.com/repos/${repo}/issues?per_page=${DEFAULT_PER_PAGE}`

  if (direction != undefined) {
    url += `&sort=created&direction=${direction}`
  }

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
 * @param {number} startPage - a possible start page for the partial history
 * @returns Promise<Array<{ date: string, count: number }>>: A promise that resolves to an array of issue records
 */
export async function getRepoIssueRecords(
  repo: string,
  token: string,
  maxRequestAmount: number,
  startPage?: number
) {
  const pageCount = await getPageCount(repo, token)

  const requestPages: number[] = []
  if (startPage == undefined) {
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
  } else {
    if (pageCount < maxRequestAmount) {
      requestPages.push(...utils.range(pageCount - startPage, pageCount))
    } else {
      utils.range(1, maxRequestAmount).forEach((i: number) => {
        requestPages.push(
          Math.round(pageCount - startPage + (i * startPage) / maxRequestAmount) - 1
        )
      })
    }
  }

  return await getRepoIssuesMap(repo, token, requestPages, maxRequestAmount)
}

/** Retrieves the page count for the issues in a GitHub repository.
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - GitHub access token.
 * @returns {Promise<number>} A promise that resolves to the total number of pages.
 * @throws {object} Throws an error object if the request fails or the repository has no issues.
 */
async function getPageCount(repo: string, token: string) {
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
  return pageCount
}

/** Retrieves the issue records (issue count by date) of a GitHub repository and returns them as an array of `IssuRecord` objects.
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - GitHub Access token for authentication
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
  const resArray = await Promise.all(
    requestPages.map((page) => {
      return getRepoIssues(repo, token, page, 'asc')
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

/** Determines how many pages in the Github history have to be considered to create a specific partial history
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - GitHub access token
 * @param {TimeFrame} timeFrame - timeFrame object which determines the timeFrame of the partial history
 * @returns {number} - number of pages to go back in the GitHub history
 */
async function goBackPages(repo: string, token: string, timeFrame: TimeFrame) {
  const today = new Date()
  let startDate = new Date()
  switch (timeFrame) {
    case 'day':
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      break
    case 'week':
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
      break
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
      break
    case '3 month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
      break
    case '6 month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())
      break
    case 'year':
      startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
      break
  }

  // now starting from the first page with sorted = desc go through the pages to find dates before startDate
  let foundDate: Date = today
  let currentPage = 1

  while (foundDate >= startDate) {
    const resArray = await getRepoIssues(repo, token, currentPage, 'desc')
    try {
      foundDate = new Date(resArray.data[29].created_at)
    } catch {
      // time frame is longer/older than the oldest issue
      currentPage = (await getPageCount(repo, token)) - 1
      return { currentPage, startDate }
    }

    if (foundDate < startDate) {
      break
    }
    currentPage = Math.max(Math.ceil(currentPage * 1.5), currentPage + 1)
  }
  return { currentPage, startDate }
}

/** Creates the partial issue history for a specific timeframe
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - Github access token
 * @param {TimeFrame} timeFrame - time frame that the history takes into account
 * @param {number} maxRequestAmount - Maximum number of API requests to make to retrieve the issue records.
 * This value can be exceeded by up to 6 times if there aren't many pages being looked at for the history
 * This mostly happens for short timeframes / not a lot of issues
 * @returns {IssueRecord[]} - An array of `IssueRecord` objects representing the issue records.
 */
export async function partialHistory(
  repo: string,
  token: string,
  timeFrame: TimeFrame,
  maxRequestAmount: number
) {
  // calculate the date to go back to
  const { currentPage, startDate } = await goBackPages(repo, token, timeFrame)
  // more than 7 pages are going to be considered => sufficient information
  if (currentPage >= 8) {
    return await getRepoIssueRecords(repo, token, maxRequestAmount, currentPage)
  } else {
    // not enough pages are being scraped so we are just taking all the data from the existing pages
    const pageCount = await getPageCount(repo, token)
    const requestPages = utils.range(pageCount - currentPage, pageCount)
    const resArray = await Promise.all(
      requestPages.map((page) => {
        return getRepoIssues(repo, token, page, 'asc')
      })
    )

    const issuesRecordsMap: Map<string, number> = new Map()

    resArray.forEach(({ data }: { data: { created_at: string }[] }, index) => {
      if (data.length > 0) {
        for (let i = 0; i < 6; i++) {
          // try statement because the last page might not be full
          try {
            const issuesRecord = data[5 * i]
            issuesRecordsMap.set(
              utils.getDateString(issuesRecord.created_at),
              DEFAULT_PER_PAGE * (requestPages[index] - 1) + 5 * i
            )
          } catch {
            break
          }
        }
      }
    })
    const issuesAmount = await getRepoIssuesCount(repo, token)
    issuesRecordsMap.set(utils.getDateString(Date.now()), issuesAmount)

    const issuesRecords: IssueRecord[] = []

    issuesRecordsMap.forEach((v, k) => {
      issuesRecords.push({
        date: k,
        count: v
      })
    })

    // filter out the wrong dates
    return issuesRecords.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate
    })
  }
}

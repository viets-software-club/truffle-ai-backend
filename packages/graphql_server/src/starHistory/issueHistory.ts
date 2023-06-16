import axios, { AxiosResponse } from 'axios'
import { IssueRecord, IssueData, TimeFrame } from './types'
import * as utils from './utils'

const DEFAULT_PER_PAGE = 30

/** Retrieves the total count of issues for a Github repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github access token
 * @returns Promise<number> : A promise that resolves to the total count of issues for the repository
 */
async function getRepoIssuesCount(repo: string, token: string): Promise<number> {
  const response: AxiosResponse<{ open_issues_count: number }> = await axios.get(
    `https://api.github.com/repos/${repo}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`
      }
    }
  )

  return response?.data?.open_issues_count
}

/** Creates the full history of issues for a repository
 * Retrieves the issue records (issue count by date) of a GitHub repository and returns them as an array of `IssuRecord` objects.
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - GitHub Access token for authentication
 * @param {number} maxRequestAmount - Maximum number of API requests to make to retrieve the issue records.
 *  * The higher this value is the more accurate is going to be the graph of the issue history
 * @param {number} startPage - possible startPage for a partialHistory
 * @returns {IssueRecord[]} - An array of `IssueRecord` objects representing the issue records.
 */
export async function getRepoIssueRecords(
  repo: string,
  token: string,
  maxRequestAmount: number,
  startPage?: number
) {
  const requestPages: number[] = await utils.getHistoryPages(
    repo,
    token,
    maxRequestAmount,
    'issue',
    startPage
  )

  const resArray = await Promise.all(
    requestPages.map((page) => {
      return utils.getRepoPage(repo, token, 'issue', page, 'asc') as Promise<
        AxiosResponse<IssueData[]>
      >
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
  const { currentPage, startDate } = await utils.goBackPages(repo, token, timeFrame, 'issue')
  // more than 7 pages are going to be considered => sufficient information
  if (currentPage >= 8) {
    return await getRepoIssueRecords(repo, token, maxRequestAmount, currentPage)
  } else {
    // not enough pages are being scraped so we are just taking all the data from the existing pages
    const pageCount = await utils.getPageCount(repo, token, 'issue')
    const requestPages = utils.range(pageCount - currentPage, pageCount)
    const resArray = await Promise.all(
      requestPages.map((page) => {
        return utils.getRepoPage(repo, token, 'issue', page, 'asc') as Promise<
          AxiosResponse<IssueData[]>
        >
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

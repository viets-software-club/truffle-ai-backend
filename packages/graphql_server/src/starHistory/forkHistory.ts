import axios, { AxiosResponse } from 'axios'
import { ForkRecord, ForksData, TimeFrame } from './types'
import * as utils from './utils'

const DEFAULT_PER_PAGE = 30

/** This method retrieves the forks from a page of a GitHub repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github Access token
 * @param {number} page - Page Number of the forks to retrieve
 * @param {string} direction - Determines in which order the pages will be: 'oldest' | 'newest'
 * All the normal history functions should use 'oldest', the partial history should use 'newest'
 * @returns Promise<Object>: A promise that resolves to the forks of the repository
 */
async function getRepoForks(
  repo: string,
  token?: string,
  page?: number,
  direction?: string
): Promise<AxiosResponse<ForksData[]>> {
  let url = `https://api.github.com/repos/${repo}/forks?per_page=${DEFAULT_PER_PAGE}`

  if (direction != undefined) {
    url += `&sort=${direction}`
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

/** Retrieves the total count of forks for a Github repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github access token
 * @returns Promise<number> : A promise that resolves to the total count of forks for the repository
 */
async function getRepoForksCount(repo: string, token?: string): Promise<number> {
  const response: AxiosResponse<{ forks_count: number }> = await axios.get(
    `https://api.github.com/repos/${repo}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: token ? `token ${token}` : ''
      }
    }
  )

  return response?.data?.forks_count
}

/** Retrieves the fork records (fork count by date) of a Github repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github Access token
 * @param {number} maxRequestAmount - Maximum number of API requests to make to retrieve the forks
 * The higher this value is the more accurate is going to be the graph of the fork history
 * @param {number} startPage - a possible start page for the partial history
 * @returns Promise<Array<{ date: string, count: number }>>: A promise that resolves to an array of fork records
 */
export async function getRepoForkRecords(
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

  return await getRepoForksMap(repo, token, requestPages, maxRequestAmount)
}

/** Retrieves the page count for the forks of a GitHub repository.
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - GitHub access token.
 * @returns {Promise<number>} A promise that resolves to the total number of pages.
 * @throws {object} Throws an error object if the request fails or the repository has no forks.
 */
async function getPageCount(repo: string, token: string) {
  const patchRes: AxiosResponse<ForksData[]> = await getRepoForks(repo, token)

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

/** Retrieves the fork records (fork count by date) of a GitHub repository and returns them as an array of `ForkRecord` objects.
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - GitHub Access token for authentication (optional).
 * @param {number[]} requestPages - Array of page numbers to request from the API.
 * @param {number} maxRequestAmount - Maximum number of API requests to make to retrieve the fork records.
 * @returns {ForkRecord[]} - An array of `ForkRecord` objects representing the fork records.
 */
async function getRepoForksMap(
  repo: string,
  token: string,
  requestPages: number[],
  maxRequestAmount: number
) {
  const resArray = await Promise.all(
    requestPages.map((page) => {
      return getRepoForks(repo, token, page, 'oldest')
    })
  )

  const forkRecordsMap: Map<string, number> = new Map()

  if (requestPages.length < maxRequestAmount) {
    const forkRecordsData: { created_at: string }[] = []
    resArray.forEach(({ data }) => {
      forkRecordsData.push(...data)
    })
    for (let i = 0; i < forkRecordsData.length; ) {
      forkRecordsMap.set(utils.getDateString(forkRecordsData[i].created_at), i + 1)
      i += Math.floor(forkRecordsData.length / maxRequestAmount) || 1
    }
  } else {
    resArray.forEach(({ data }: { data: { created_at: string }[] }, index) => {
      if (data.length > 0) {
        const forkRecord = data[0]
        forkRecordsMap.set(
          utils.getDateString(forkRecord.created_at),
          DEFAULT_PER_PAGE * (requestPages[index] - 1)
        )
      }
    })
  }

  const forkAmount = await getRepoForksCount(repo, token)
  forkRecordsMap.set(utils.getDateString(Date.now()), forkAmount)

  const forkRecords: ForkRecord[] = []

  forkRecordsMap.forEach((v, k) => {
    forkRecords.push({
      date: k,
      count: v
    })
  })

  return forkRecords
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
    const resArray = await getRepoForks(repo, token, currentPage, 'newest')
    try {
      foundDate = new Date(resArray.data[29].created_at)
    } catch {
      // time frame is longer/older than the oldest fork
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

/** Creates the partial fork history for a specific timeframe
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - Github access token
 * @param {TimeFrame} timeFrame - time frame that the history takes into account
 * @param {number} maxRequestAmount - Maximum number of API requests to make to retrieve the fork records.
 * This value can be exceeded by up to 6 times if there aren't many pages being looked at for the history
 * This mostly happens for short timeframes / not a lot of forks
 * @returns {ForkRecord[]} - An array of `ForkRecord` objects representing the fork records.
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
    return await getRepoForkRecords(repo, token, maxRequestAmount, currentPage)
  } else {
    // not enough pages are being scraped so we are just taking all the data from the existing pages
    const pageCount = await getPageCount(repo, token)
    const requestPages = utils.range(pageCount - currentPage, pageCount)
    const resArray = await Promise.all(
      requestPages.map((page) => {
        return getRepoForks(repo, token, page, 'oldest')
      })
    )

    const forkRecordsMap: Map<string, number> = new Map()

    resArray.forEach(({ data }: { data: { created_at: string }[] }, index) => {
      if (data.length > 0) {
        for (let i = 0; i < 6; i++) {
          // try statement because the last page might not be full
          try {
            const forkRecord = data[5 * i]
            forkRecordsMap.set(
              utils.getDateString(forkRecord.created_at),
              DEFAULT_PER_PAGE * (requestPages[index] - 1) + 5 * i
            )
          } catch {
            break
          }
        }
      }
    })
    const forkAmount = await getRepoForksCount(repo, token)
    forkRecordsMap.set(utils.getDateString(Date.now()), forkAmount)

    const forkRecords: ForkRecord[] = []

    forkRecordsMap.forEach((v, k) => {
      forkRecords.push({
        date: k,
        count: v
      })
    })

    // filter out the wrong dates
    return forkRecords.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate
    })
  }
}

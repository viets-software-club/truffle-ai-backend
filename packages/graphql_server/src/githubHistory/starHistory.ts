import axios, { AxiosResponse } from 'axios'
import { StarRecord, StargazersData, TimeFrame } from './types'
import * as utils from './utils'

const DEFAULT_PER_PAGE = 30

/** Retrieves the total count of stargazers for a Github repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github access token
 * @returns Promise<number> : A promise that resolves to the total count of stargzers for the repository
 */
async function getRepoStargazersCount(repo: string, token: string): Promise<number> {
  const response: AxiosResponse<{ stargazers_count: number }> = await axios.get(
    `https://api.github.com/repos/${repo}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3.star+json',
        Authorization: `token ${token}`
      }
    }
  )

  return response?.data?.stargazers_count
}

/** Creates the full history of stars for a repository
 * Retrieves the star records (star count by date) of a GitHub repository and returns them as an array of `StarRecord` objects.
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - GitHub Access token for authentication (optional).
 * @param {number} maxRequestAmount - Maximum number of API requests to make to retrieve the star records.
 * The higher this value is the more accurate is going to be the graph of the star history
 * @param {number} startPage - possible startPage for a partialHistory
 * @param {Date} startDate - possible startDate for a partialHistory
 * @returns {StarRecord[]} - An array of `StarRecord` objects representing the star records.
 */
export async function getRepoStarRecords(
  repo: string,
  token: string,
  maxRequestAmount: number,
  startPage?: number,
  startDate?: Date
) {
  // check if there are any issues at all
  if ((await getRepoStargazersCount(repo, token)) == 0) {
    return {}
  }
  const requestPages: number[] = await utils.getHistoryPages(repo, token, 10, 'star', startPage)

  const resArray = await Promise.all(
    requestPages.map((page) => {
      return utils.getRepoPage(repo, token, 'star', page, 'asc') as Promise<
        AxiosResponse<StargazersData[]>
      >
    })
  )

  const starRecordsMap: Map<string, number> = new Map()

  if (requestPages.length < maxRequestAmount) {
    const starRecordsData: { starred_at: string }[] = []
    resArray.forEach(({ data }) => {
      starRecordsData.push(...data)
    })
    for (let i = 0; i < starRecordsData.length; ) {
      starRecordsMap.set(utils.getDateString(starRecordsData[i].starred_at), i + 1)
      i += Math.floor(starRecordsData.length / maxRequestAmount) || 1
    }
  } else {
    resArray.forEach(({ data }: { data: { starred_at: string }[] }, index) => {
      if (data.length > 0) {
        const starRecord = data[0]
        starRecordsMap.set(
          utils.getDateString(starRecord.starred_at),
          DEFAULT_PER_PAGE * (requestPages[index] - 1)
        )
      }
    })
  }

  const starAmount = await getRepoStargazersCount(repo, token)
  starRecordsMap.set(utils.getDateString(Date.now()), starAmount)

  const starRecords: StarRecord[] = []

  starRecordsMap.forEach((v, k) => {
    starRecords.push({
      date: k,
      count: v
    })
  })

  if (startDate == undefined || startDate == null) {
    return starRecords
  }

  // filter out the wrong dates
  return starRecords.filter((item) => {
    const itemDate = new Date(item.date)
    return itemDate >= startDate
  })
}

/** Creates the partial star history for a specific timeframe
 * @param {string} repo - Name of the GitHub repository in the format "owner/repository".
 * @param {string} token - Github access token
 * @param {TimeFrame} timeFrame - time frame that the history takes into account
 * @param {number} maxRequestAmount - Maximum number of API requests to make to retrieve the star records.
 * This value can be exceeded by up to 6 times if there aren't many pages being looked at for the history
 * This mostly happens for short timeframes / not a lot of stars
 * @returns {StarRecord[]} - An array of `StarRecord` objects representing the star records.
 */
export async function partialStarHistory(
  repo: string,
  token: string,
  timeFrame: TimeFrame,
  maxRequestAmount: number
) {
  // check if there are any issues at all
  if ((await getRepoStargazersCount(repo, token)) == 0) {
    return {}
  }
  // calculate the date to go back to
  const { currentPage, startDate } = await utils.goBackPages(repo, token, timeFrame, 'star')

  // more than 7 pages are going to be considered => sufficient information
  if (currentPage >= 8) {
    return await getRepoStarRecords(repo, token, maxRequestAmount, currentPage, startDate)
  } else {
    // not enough pages are being scraped so we are just taking all the data from the existing pages
    const pageCount = await utils.getPageCount(repo, token, 'star')

    // the absolute maximum amount of stars to be able to handle so far is 40k
    // which is equivalent to about 1333 pages
    // if pagecount is above 1333 then just return the full history
    if (pageCount >= 1330) {
      return await getRepoStarRecords(repo, token, maxRequestAmount, currentPage)
    }
    const requestPages = utils.range(pageCount - currentPage, pageCount)

    return formatStars(repo, token, startDate, requestPages)
  }
}

/** Formats the star records for a GitHub repository within a specified date range and pagination.
 * @param {string} repo - The GitHub repository name in the format "owner/repo".
 * @param {string} token - GitHub personal access token for authentication.
 * @param {Date} startDate - The start date of the date range for star records.
 * @param {number[]} requestPages - An array of page numbers to fetch star records.
 * @returns {Promise<StarRecord[]>} - A Promise that resolves to an array of StarRecord objects.
 */
async function formatStars(repo: string, token: string, startDate: Date, requestPages: number[]) {
  const resArray = await Promise.all(
    requestPages.map((page) => {
      try {
        return utils.getRepoPage(repo, token, 'star', page, 'asc') as Promise<
          AxiosResponse<StargazersData[]>
        >
      } catch {
        // too many stars to traverse for a single repo
        // this should not happen under the restriction of limiting this function
        // to 40k stars
        const dubInfo: { data: { starred_at: string }[] } = {
          data: [{ starred_at: utils.getDateString(Date.now()) }]
        }
        return dubInfo
      }
    })
  )
  const starRecordsMap: Map<string, number> = new Map()

  resArray.forEach(({ data }: { data: { starred_at: string }[] }, index) => {
    if (data.length > 0) {
      for (let i = 0; i < 6; i++) {
        // try statement because the last page might not be full
        try {
          const starRecord = data[5 * i]
          starRecordsMap.set(
            utils.getDateString(starRecord.starred_at),
            DEFAULT_PER_PAGE * (requestPages[index] - 1) + 5 * i
          )
        } catch {
          break
        }
      }
    }
  })

  const starAmount = await getRepoStargazersCount(repo, token)
  starRecordsMap.set(utils.getDateString(Date.now()), starAmount)

  const starRecords: StarRecord[] = []

  starRecordsMap.forEach((v, k) => {
    starRecords.push({
      date: k,
      count: v
    })
  })

  // filter out the wrong dates
  return starRecords.filter((item) => {
    const itemDate = new Date(item.date)
    return itemDate >= startDate
  })
}

import axios, { AxiosResponse } from 'axios'
import { ForkRecord, ForksData } from './types'
import * as utils from './utils'

const DEFAULT_PER_PAGE = 30

/** This method retrieves the forks from a page of a GitHub repository
 * @param {string} repo - Name of the Github repository: "owner/repository"
 * @param {string} token - Github Access token
 * @param {number} page - Page Number of the forks to retrieve
 * @returns Promise<Object>: A promise that resolves to the forks of the repository
 */
async function getRepoForks(
  repo: string,
  token?: string,
  page?: number
): Promise<AxiosResponse<ForksData[]>> {
  let url = `https://api.github.com/repos/${repo}/forks?per_page=${DEFAULT_PER_PAGE}`

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
 * @returns Promise<Array<{ date: string, count: number }>>: A promise that resolves to an array of fork records
 */
export async function getRepoForkRecords(repo: string, token: string, maxRequestAmount: number) {
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
  return await getRepoForksMap(repo, token, requestPages, maxRequestAmount)
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
      return getRepoForks(repo, token, page)
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

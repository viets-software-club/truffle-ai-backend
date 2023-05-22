import axios, { AxiosRequestConfig } from 'axios'
import dotenv from 'dotenv'

dotenv.config()

type LinkedInCompanyProfile = {
  name: string
  founded: string
  sphere: string
  followers: number
  employeesAmountInLinkedin: string
  about: string
  website: string
  crunchbaseUrl: string
  industries: string
  hqLocation: string
  specialties: string
}

type CompanyDataResponse = {
  url: string
  name: string
  founded: string
  sphere: string
  followers: number
  logo: string
  image: string
  employeesAmountInLinkedin: string
  about: string
  website: string
  locations: string[]
  employees: {
    img: string
    title: string
    subtitle: string
  }[]
  updates: {
    time: string
    text: string
    likes_count: number
    comments_count: number
  }[]
  show_more: string[]
  affiliated: {
    title: string
    subtitle: string
    location: string
    Links: string
  }[]
  browse_jobs: string[]
  company_id: string
  timestamp: string
  slogan: string
  crunchbase_url: string
  stock_info: string
  funding: string
  investors: string
  similarPages: string[]
  Website: string
  Industries: string
  'Company size': string
  Headquarters: string
  Type: string
  Specialties: string
} | null

const username = 'typescript2023'
const apiKey = process.env.SCRAPING_BOT_API_KEY || ''
const apiEndPoint = 'http://api.scraping-bot.io/scrape/data-scraper'
const auth = 'Basic ' + Buffer.from(username + ':' + apiKey).toString('base64')

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function getCompanyInfosFromLinkedIn(
  linkedInHandle: string
): Promise<LinkedInCompanyProfile> {
  try {
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Accept: 'application/json',
        Authorization: auth
      }
    }

    const requestData = {
      scraper: 'linkedinCompanyProfile',
      url: 'https://linkedin.com/company/' + linkedInHandle
    }

    const response = await axios.post<{ responseId: string }>(
      apiEndPoint,
      requestData,
      requestConfig
    )
    console.log(response)

    let finalData: CompanyDataResponse | null = null
    do {
      await sleep(5000)
      const responseUrl = `http://api.scraping-bot.io/scrape/data-scraper-response?scraper=linkedinCompanyProfile&responseId=${response.data.responseId}`
      const finalDataResponse = await axios.get<CompanyDataResponse[]>(responseUrl, requestConfig)
      finalData = finalDataResponse.data[0]
    } while (finalData === null)

    return {
      name: finalData.name ?? '',
      founded: finalData.founded ?? '',
      sphere: finalData.sphere ?? '',
      followers: finalData.followers ?? '',
      employeesAmountInLinkedin: finalData.employeesAmountInLinkedin ?? 0,
      about: finalData.about ?? '',
      website: finalData.website ?? '',
      crunchbaseUrl: finalData.crunchbase_url ?? '',
      industries: finalData.Industries ?? '',
      hqLocation: finalData.Headquarters ?? '',
      specialties: finalData.Specialties ?? ''
    }
  } catch (error) {
    console.log(error)
    throw new Error('Was not able to scrape company info for ' + linkedInHandle)
  }
}

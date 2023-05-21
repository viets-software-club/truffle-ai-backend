import axios, { AxiosResponse } from 'axios'
import * as cheerio from 'cheerio'

type LinkedInProfile = {
  name: string
  employmentList: string[]
  educationList: string[]
}

async function getCompanyInfosFromLinkedIn(linkedInHandle: string): Promise<LinkedInProfile> {
  const basePath = 'https://www.linkedin.com/company/'
  try {
    const response: AxiosResponse<string> = await axios.get(basePath + linkedInHandle)
    if (!response.data) {
      return {
        name: '',
        employmentList: [],
        educationList: []
      }
    }
    const DOM = cheerio.load(response.data)
    console.log(response.data)
    const name = DOM('div.ProfileHeaderCard > h1 > a').text().trim()
    console.log(name)

    return {
      name: name,
      employmentList: [],
      educationList: []
    }
  } catch (error) {
    console.log(error)
    throw new Error('Error while scraping company infos from LinkedIn')
  }
}

void getCompanyInfosFromLinkedIn('ferrari').then((r) => console.log(r))

/*
  public async getPersonalInfosFromLinkedIn(linkedInHandle: string) {
    const basePath = 'https://www.linkedin.com/in/';

  }
*/

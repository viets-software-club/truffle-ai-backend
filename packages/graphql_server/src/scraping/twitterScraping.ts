import axios, { AxiosRequestConfig } from 'axios'
import { TwitterPost, TwitterUser, TwitterProfileResponse } from '../../types/twitterScraping'

const username = process.env.SCRAPING_BOT_USER_NAME || ''
const apiKey = process.env.SCRAPING_BOT_API_KEY || ''
const apiEndPoint = process.env.SCRAPING_BOT_API_ENDPOINT || ''
const auth = 'Basic ' + Buffer.from(username + ':' + apiKey).toString('base64')

const SORT_BY_RETWEETS = 'retweets'
const SORT_BY_LIKES = 'likes'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Fetches the Twitter user by his handle
 * @param twitterHandle
 * @returns the TwitterUser with id, name and count of followers
 */
async function getTwitterUserByHandle(twitterHandle: string): Promise<TwitterUser> {
  try {
    // builds the axios request configuration
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Accept: 'application/json',
        Authorization: auth
      }
    }
    // specifies the used scraping mechanism, which is in this case twitterProfile
    const requestData = {
      scraper: 'twitterProfile',
      url: 'https://twitter.com/' + twitterHandle
    }

    const response = await axios.post<{ responseId: string }>(
      apiEndPoint,
      requestData,
      requestConfig
    )

    let data: TwitterProfileResponse | null = null

    // sends the request until finalData is received
    // Waits for 5 seconds, because scraping bot API has built-in mechanism to avoid blocking us as scrapers
    do {
      await sleep(5000)
      const responseUrl = `http://api.scraping-bot.io/scrape/data-scraper-response?scraper=twitterProfile&responseId=${response.data.responseId}`
      const finalDataResponse = await axios.get<TwitterProfileResponse>(responseUrl, requestConfig)
      data = finalDataResponse.data
    } while (data === null || (data.data[0].status && data.data[0].status === 'pending'))

    const userData = data.data[0]
    return {
      profileName: userData.profile_name ?? '',
      isVerified: userData.isVerified ?? false,
      bio: userData.bio ?? '',
      followers: userData.following ?? -1,
      websiteUrl: userData.website_url ?? '',
      handle: userData.handle ?? '',
      postsInfo: userData.posts_info ?? []
    }
  } catch (error) {
    console.log(error)
    throw new Error('Was not able to scrape twitter profile of ' + twitterHandle)
  }
}

/**
 * Fetches tweets of a given user by his username, sorts and splits those into the 10 most popular ones
 *
 * @param twitterHandle
 * @param sortingCriterion: specifies whether to sort the tweets by likes or by retweets
 * @returns an array with the 10 most popular TwitterPost including their id, content, count of retweets and like count
 */

async function getMostPopularTweetsByUser(
  twitterHandle: string,
  sortingCriterion: string
): Promise<TwitterPost[]> {
  const twitterUser = await getTwitterUserByHandle(twitterHandle)
  const tweets = twitterUser.postsInfo

  return (
    tweets
      // filters out only the posts that are posted by the twitter user and only text-posts
      .filter((t) => !t.isRetweeted && t.media_type === 'text')
      .sort((a, b) => {
        if (sortingCriterion === SORT_BY_LIKES) {
          return b.likes - a.likes
        } else if (sortingCriterion === SORT_BY_RETWEETS) {
          return b.retweets - a.retweets
        } else {
          return 0
        }
      })
      .slice(0, 10)
      .map((tweet) => {
        return {
          id: tweet.id,
          text: tweet.text,
          retweetCount: tweet.retweets,
          likeCount: tweet.likes,
          replies: tweet.replies,
          url: tweet.post_url
        }
      })
  )
}

export default { getMostPopularTweetsByUser, getTwitterUserByHandle }

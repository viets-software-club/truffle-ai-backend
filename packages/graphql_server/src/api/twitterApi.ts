import {Client} from 'twitter-api-sdk'
import dotenv from 'dotenv'

dotenv.config()

type TwitterUser = {
  id: string
  name: string
  followersCount: number
}

type TwitterPost = {
  id: string
  retweetCount: number
  likeCount: number
}

const bearerToken = process.env.TWITTER_BEARER_TOKEN || ''

const twitterClient = new Client(bearerToken)
const SORT_BY_RETWEETS = 'retweets'
const SORT_BY_LIKES = 'likes'

/**
 * Fetches the Twitter user by his handle
 * @param twitterHandle
 * @returns the TwitterUser with id, name and count of followers
 */
async function getTwitterUserByHandle(twitterHandle: string): Promise<TwitterUser> {
  const response = await twitterClient.users.findUserByUsername(twitterHandle)
  if (!response) {
    throw new Error(`Could not find the user with username: ${twitterHandle}`)
  }

  const data = response.data

  // if data is present, returns a TwitterUser with relevant fields
  return {
    id: data?.id ?? '',
    name: data?.name ?? '',
    followersCount: data?.public_metrics?.followers_count ?? 0
  }
}

/**
 * Fetches 100 tweets of a given user by his username and sorts and splits those into the 10 most popular ones
 *
 * public_metrics can look like:
 *
 *    "public_metrics": {
 *                "retweet_count": 5219,
 *                "reply_count": 1828,
 *                "like_count": 17141,
 *                "quote_count": 3255
 *            }
 *
 * source: https://developer.twitter.com/en/docs/twitter-api/data-dictionary/using-fields-and-expansions
 *
 * pagination and the max_results documentation can be found here:
 * https://developer.twitter.com/en/docs/twitter-api/pagination
 *
 * @param twitterHandle
 * @param sortingCriterion: specifies whether to sort the tweets by likes or by retweets
 * @returns an array with the 10 most popular TwitterPost including their id, count of retweets and like count
 */

async function getMostPopularTweetsByUser(
  twitterHandle: string,
  sortingCriterion: string
): Promise<TwitterPost[]> {
  const twitterUser = await getTwitterUserByHandle(twitterHandle)

  // Returns a list of Tweets with their public_metrics authored by the provided User ID and cuts it at 100
  const tweetsResponse = await twitterClient.tweets.usersIdTweets(twitterUser.id, {
    max_results: 100,
    'tweet.fields': ['public_metrics']
  })

  if (!tweetsResponse || !tweetsResponse.data) {
    throw new Error(`Could not find tweets for following user: ${twitterHandle}`)
  }

  const tweets = tweetsResponse.data

  // Sorts the tweets based on their retweets or likes specified by the sorting criterion,
  // takes the first (most popular) 10 and returns them in an array

  return tweets
    .sort((a, b) => {
      if (sortingCriterion === SORT_BY_LIKES) {
        return (b.public_metrics?.like_count ?? 0) - (a.public_metrics?.like_count ?? 0)
      } else if (sortingCriterion === SORT_BY_RETWEETS) {
        return (b.public_metrics?.retweet_count ?? 0) - (a.public_metrics?.retweet_count ?? 0)
      } else {
        return 0
      }
    })
    .slice(0, 10)
    .map((tweet) => {
      return {
        id: tweet.id,
        retweetCount: tweet.public_metrics?.retweet_count ?? 0,
        likeCount: tweet.public_metrics?.like_count ?? 0
      }
    })
}

export default {getMostPopularTweetsByUser, getTwitterUserByHandle}

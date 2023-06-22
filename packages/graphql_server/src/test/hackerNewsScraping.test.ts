/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  searchHackerNewsStories,
  getHackerNewsCommentsByPostId
} from '../scraping/hackerNewsScraping'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function testHackerNewsScraping() {
  console.log(
    '\nCall it with valid parameters: should return a list of comments and a list of links to the posts \n'
  )
  console.log(await searchHackerNewsStories('AntonOsika/gpt-engineer'))

  console.log('\nCall with repoName that does not exist on Hackernews: should return null\n')
  console.log(await searchHackerNewsStories('fdsjodsa'))

  console.log(
    '\nCall with repoName that has very few entries: should return short comments and links arrays'
  )
  console.log(await searchHackerNewsStories('steven-tey/novel'))

  console.log(
    '\nCall it with valid parameters for old topic: returns null if all the top restults are too old'
  )
  console.log(await searchHackerNewsStories('react'))

  console.log('\nCall it with an empty string: returns random posts based on general topics.')
  console.log(await searchHackerNewsStories(''))

  console.log(
    '\n--- Call with random symbols: returns a bad request. The algolia api does not work with that'
  )
  console.log(await searchHackerNewsStories('%()§$Q§$!'))
}
export async function testHackerNewsScrapingPostId() {
  console.log('\nCall with a wrong postId: should return an empty array\n')
  console.log(await getHackerNewsCommentsByPostId('123'))

  console.log('\nCall with a negative postId: should return an empty array\n')
  console.log(await getHackerNewsCommentsByPostId('-36422730'))

  console.log('\nCall with a normal postId: should return a list of comments\n')
  console.log(await getHackerNewsCommentsByPostId('36422730'))

  console.log('\nCall with a postId that has many posts: should return a list of comments\n')
  console.log(await getHackerNewsCommentsByPostId('36309120'))

  console.log('\nCall with a postId that has zero posts: should return an empty array\n')
  console.log(await getHackerNewsCommentsByPostId('36345988'))

  console.log('\nCall with null: should return comments\n')
  console.log(await getHackerNewsCommentsByPostId('36345988'))
}

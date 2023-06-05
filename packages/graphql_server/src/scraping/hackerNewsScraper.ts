import axios from 'axios'

import {
  HackerNewsStoriesResponse,
  HackerNewsStoriesResponseHitsArray,
  HackerNewsStoriesResponseHit,
  GetHackerNewsCommentsResponseHits,
  GetHackerNewsCommentsResponseHitArray
} from '../../types/hackerNews'

/**
 * Search Hacker News stories based on the given name, retrieve comments,
 * and generate an OpenAI request.
 * @param name - The search query to find Hacker News stories.
 * @returns A promise that resolves to the OpenAI request.
 */
async function searchHackerNewsStories(name: string) {
  const url = `http://hn.algolia.com/api/v1/search?query=${name}&tags=story`
  const allComments: string[] = [] //stores the comments found by getHackernewsCommentsByPostId

  try {
    const response = await axios.get(url)
    const formattedJson = response.data as HackerNewsStoriesResponse
    const hitslist: HackerNewsStoriesResponseHitsArray = formattedJson.hits

    for (let i = 0; i < hitslist.length; i++) {
      const hit: HackerNewsStoriesResponseHit = hitslist[i]
      const createdAt: string = hit?.created_at
      const objectId: string = hit?.objectID

      if (!isMoreThanMonthsTwoAgo(createdAt)) {
        const comments: string[] | undefined = await getHackerNewsCommentsByPostId(objectId)
        if (comments) {
          for (let j = 0; j < comments.length; j++) {
            allComments.push(comments[j])
          }
        }
      }
    }
    return allComments.join(' ')
  } catch (error) {
    console.log('Error fetching HTML code:', error)
  }
}

/**
 * Retrieve Hacker News comments for a given story ID.
 * @param story_id - The ID of the story to fetch comments for.
 * @returns A promise that resolves to an array of comments.
 */
async function getHackerNewsCommentsByPostId(story_id: string) {
  const url = `http://hn.algolia.com/api/v1/search?tags=comment,story_${story_id}`
  const comments: string[] = [] //an array in which we store all the scraped comments

  try {
    const response = await axios.get(url)
    const jsonData: GetHackerNewsCommentsResponseHits =
      response?.data as GetHackerNewsCommentsResponseHits
    const data: GetHackerNewsCommentsResponseHitArray = jsonData?.hits

    for (let i = 0; i < data.length; i++) {
      comments.push(data[i]?.comment_text)
    }

    console.log(`For story_id ${story_id}, so viele Kommentare gefunden: ${comments.length}`)
    return comments
  } catch (error) {
    console.log('Error fetching data:', error)
  }
}

/**
 * Check if the given JSON-formatted date is more than two months ago.
 * @param jsonDate - The JSON-formatted date string to compare.
 * @returns A boolean indicating if the date is more than two months ago.
 */
function isMoreThanMonthsTwoAgo(jsonDate: string): boolean {
  const jsonDateObj = new Date(jsonDate)
  const currentDate = new Date()
  const timeDiff = currentDate.getTime() - jsonDateObj.getTime()
  const twoMonthsInMillis = 60 * 24 * 60 * 60 * 1000
  return timeDiff > twoMonthsInMillis
}

/**
 * Entry point of the program. /Test main method
 */
function main(): void {
  void searchHackerNewsStories('e2b')
}

main()

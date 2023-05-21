import { openAIRequestHackernews } from './eli5'
import {
  HackerNewsStoriesResponse,
  HackerNewsStoriesResponseHitsArray,
  HackerNewsStoriesResponseHit,
  GetHackerNewsCommentsResponseHits,
  GetHackerNewsCommentsResponseHitArray
} from './types/index'

/*
This function checks if the elements on the first page are older than 2 months. 
It takes a JSON-formatted date string as input and returns true if the date is more
than two months ago, and false otherwise.
*/

function isMoreThanTwoMonthApart(jsonDate: string) {
  const jsonDateObj: Date = new Date(jsonDate)
  const currentDate = new Date()

  const timeDiff = currentDate.getTime() - jsonDateObj.getTime()

  const twoMonthsInMillis = 60 * 24 * 60 * 60 * 1000

  return timeDiff > twoMonthsInMillis
}

/*
This function retrieves Hacker News stories based on the given name. It makes a request to the Hacker News API, extracts the required information from the JSON response,
 and stores the comments in a string. It also calls the getHackerNewsComments function 
 to retrieve comments for each story. The resulting comments are concatenated into the allComments string.
*/

function getHackerNewsStories(name: string) {
  const url = `http://hn.algolia.com/api/v1/search?query=${name}&tags=story`
  console.log(url)
  let allComments = ''

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Error fetching HTML code')
      }
      return response.text()
    })
    .then(async function (htmlCode: string) {
      try {
        const formattedJson = JSON.parse(htmlCode) as HackerNewsStoriesResponse
        const hitslist: HackerNewsStoriesResponseHitsArray = formattedJson['hits']

        for (let i = 0; i < hitslist.length; i++) {
          const hit: HackerNewsStoriesResponseHit = hitslist[i]
          const createdAt: string = hit.created_at
          const objectId: string = hit.objectID

          if (!isMoreThanTwoMonthApart(createdAt)) {
            const comments = await getHackerNewsComments(objectId)
            for (let i = 0; i < comments.length; i++) {
              allComments += comments[i]
              allComments += '\n'
            }
          }
        }
        return openAIRequestHackernews(allComments)
      } catch {
        console.log('received json file has the wrong format')
      }
    })
    .catch(function (error) {
      console.log('Error fetching HTML code:', error)
    })
}

/*
This async function receives the ID of a story and returns the comments associated with that story.
It fetches the comments from the Hacker News API in JSON format, processes the JSON response, and
returns an array of comment texts.
*/

async function getHackerNewsComments(story_id: string) {
  const url = `http://hn.algolia.com/api/v1/search?tags=comment,story_${story_id}`
  const comments: string[] = []

  await fetch(url)
    .then(function (response) {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Error fetching data')
      }
    })
    .then(function (jsonData: GetHackerNewsCommentsResponseHits) {
      const data: GetHackerNewsCommentsResponseHitArray = jsonData?.hits
      for (let i = 0; i < data.length; i++) {
        comments.push(data[i].comment_text)
      }
    })
    .catch(function (error) {
      console.log('Error fetching data:', error)
    })

  console.log(`For story_id  ${story_id} , so viele Kommentare gefunden:  ${comments.length}`)
  return comments
}

/*
This method can be used to test the current implementation
*/

function main() {
  getHackerNewsStories('e2b')
}

main()

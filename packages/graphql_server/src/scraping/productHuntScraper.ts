import axios, { AxiosRequestConfig } from 'axios'
import * as cheerio from 'cheerio'
import * as showdown from 'showdown'
interface Hit {
  id: string
  title: string
  url: string
  votes: number
}

/**
 * Redirect URI: https://localhost:3000/
 *
 * API Key: jv5_bUQPAgsEVA6NBjlPn_vwaubD034VJPYMokvdtZs
 *
 * API Secret: B-uqML3O88TzMsKwosPk5URwPmQJCFLLX8dWg4liF3M
 */

/*
async function getProductHuntHits(searchKeyword: string): Promise<Hit[]> {
  const API_URL = 'https://api.producthunt.com/v2/api/graphql'
  const TOKEN = '1QEIxX_jdtjGVoHbZI0WTO3dbiV_sZumVP18t8I0yHk' // Replace with your Product Hunt API token
  console.log(searchKeyword) //privateGPT
  const query = `
    query GetTopics {
      topics(query: "Health") {
        nodes {
          id
          name
          description
          url
          createdAt
          image
          followersCount
        }
      }
    }
  `
  const variables = {
    searchKeyword: searchKeyword
  }

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  try {
    const response = await axios.post(API_URL, { query, variables }, config)
    console.log(response.data)
    // Process the response data
    const topicNodes = response.data.data.topics.nodes
    console.log(topicNodes)
    for (const topicNode of topicNodes) {
      console.log(topicNode)
    }
    const hits: Hit[] = response.data.data.topics.nodes.flatMap((topic: any) =>
      topic.posts.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.name,
        url: edge.node.url,
        votes: edge.node.votesCount
      }))
    )

    return hits
  } catch (error) {
    console.error('Error retrieving Product Hunt hits:', error)
    throw error
  }
}

// Usage
getProductHuntHits('privateGPT')
  .then((hits) => {
    console.log('Product Hunt Hits:', hits)
    // Do something with the hits
  })
  .catch((error) => {
    console.error('Error:', error)
    // Handle error
  })
*/

async function getProductHuntSearchResults(keyword) {
  const API_URL = `https://www.producthunt.com/search?q=${encodeURIComponent(keyword)}`

  try {
    const response = await axios.get(API_URL)
    const $ = cheerio.load(response.data)
    const html = $.html()
    const converter = new showdown.Converter()

    const htmlText = converter.makeHtml(html)
    console.log(html)
  } catch (error) {
    console.error('Error fetching HTML:', error)
  }
}

// Usage
getProductHuntSearchResults('privateGTP')
  .then((data) => {
    console.log('Product Hunt Search Results:')
    // Do something with the search results
  })
  .catch((error) => {
    console.error('Error:', error)
    // Handle error
  })

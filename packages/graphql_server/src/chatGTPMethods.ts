import axios from 'axios'
import { RequestBodyOpenAI, ResponseBodyOpenAi } from './types'

/**
 * The JSON request body for the ELI5 (Explain Like I'm 5) OpenAI API.
 */
const request_body_Eli5 = `{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are a Computer Science Teacher talking to his students and the students do not have a deep technical understanding. So the teacher tries to stay simple"},{"role":"user","content":""}]}`

/**
 * The JSON request body for the Hackernews OpenAI API.
 */
const request_body_Hackernews = `{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are trying to decide whether you would like to invest in a startup. So you are evaluating these comments"},{"role":"user","content":""}]}`

/**
 * The JSON request body for the Categoriazion of the project using  OpenAI API.
 */
const request_body_Categories = `{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are a professore trying to categorize a project. You have to read something about the project and then give it two of the categroeies according to your valuation"},{"role":"user","content":""}]}`

/**
 * The question prompt for the ELI5 request.
 */
const questionEli5 =
  'The following text describes a programming project that is currently in development. Explain to me what the project is trying to achieve without telling me how they are doing so. Please use around 50 words and do not get too technical'

/**
 * The question prompt for the Hackernews request.
 */
const questionHackernews =
  'The following comments are discussing a new software project. Please get general sentiment regarding the project and use a percentage on whether people like it or not. Please stay around 50 words'

/**
 * The question prompt for the categories
 */
const questionCategories =
  'These 5 categroies should be used to categorize a software engineering project. Please use the following Text which can either be a read me or just words which are used to describe the project. Please choose two of the 5 categories I provided in the beginning that describe this project the best based on these words or readmereadme (Your response should only consist of the two words you choose. So if you think Front End and Education fit the best your response should be FrontEnd,Education): '

/**
 * The URL used to request the Response
 */
const postURL = 'https://api.openai.com/v1/chat/completions'

/**
 * Header for the request
 */

const applicationType = 'application/json'
const openAiKey = 'Bearer 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'
const errorMessage =
  ' The fetched response was empty. Most likely there is something wrong with the JSON request. '
/**
 * Send a request to the ELI5 OpenAI API to generate a response.
 * @param readME - The text to be explained.
 * @returns The generated explanation from the ELI5 API.
 */
async function openAIRequestEli5(readME: string) {
  const jsonRequestBody = JSON.parse(request_body_Eli5) as RequestBodyOpenAI
  jsonRequestBody.messages[1].content = questionEli5
  try {
    const response = await axios.post(postURL, jsonRequestBody, {
      headers: {
        'Content-Type': applicationType,
        Authorization: openAiKey
      }
    })

    const data = response.data as ResponseBodyOpenAi
    if (!data?.choices[0]?.message?.content) {
      console.log(errorMessage)
      return null
    } else {
      const content: string = data.choices[0].message.content
      console.log(content)
      return content
    }
  } catch (error) {
    console.log('AI request did not work: ', error)
    return null
  }
}

/**
 * Send a request to the Hackernews OpenAI API to generate a response.
 * @param comments - The comments to be evaluated.
 * @returns The generated response from the Hackernews API.
 */
async function openAIRequestHackernews(comments: string) {
  const jsonRequestBody = JSON.parse(request_body_Hackernews) as RequestBodyOpenAI
  jsonRequestBody.messages[1].content = questionHackernews + ' ' + comments

  try {
    const response = await axios.post(postURL, jsonRequestBody, {
      headers: {
        'Content-Type': applicationType,
        Authorization: openAiKey
      }
    })

    const data = response.data as ResponseBodyOpenAi
    if (!data?.choices[0]?.message?.content) {
      console.log(errorMessage)
      return null
    } else {
      const content: string = data.choices[0].message.content
      return content
    }
  } catch (error) {
    console.log('OpenAI request did not work out: ', error)
    return null
  }
}

/**
 * Send a request to the OpenAI API to generate a response that Categorizes the project.
 * @param comments - The comments to be evaluated.
 * @returns The generated response from the Hackernews API.
 */

async function categorizeProject(readMeOrCategory: string) {
  const jsonRequestBody = JSON.parse(request_body_Categories) as RequestBodyOpenAI
  const listOfCategories: string[] = [
    'Ai and ML',
    'Front End',
    'Back End',
    'Educational',
    'Improving existing technology'
  ]

  jsonRequestBody.messages[1].content =
    listOfCategories.join(' ,') + questionCategories + readMeOrCategory

  console.log(jsonRequestBody.messages[1].content)

  try {
    const response = await axios.post(postURL, jsonRequestBody, {
      headers: {
        'Content-Type': applicationType,
        Authorization: openAiKey
      }
    })

    const data = response.data as ResponseBodyOpenAi
    if (!data?.choices[0]?.message?.content) {
      console.log(errorMessage)
      return null
    } else {
      const content: string = data.choices[0].message.content
      console.log(content)
      return content
    }
  } catch (error) {
    console.log('AI request did not work: ', error)
    return null
  }
}

void openAIRequestEli5('her ist das readme')

export { openAIRequestHackernews }

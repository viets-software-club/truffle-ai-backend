import { RequestBodyOpenAI, ResponseBodyOpenAi } from './types/index'

/*
This variable stores the request body as a JSON-formatted string for the "eli5" model. 
It includes a system message to provide context for the conversation.
*/
const request_body_Eli5 = `{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are a Computer Science Teacher talking to his students and the students do not have a deep technical understanding. So the teacher tries to stay simple"},{"role":"user","content":""}]}`

/*
This variable stores the request body as a JSON-formatted string for the "hackernews" model.
It includes a system message to provide context for the conversation.
*/

const request_body_Hackernews = `{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are trying to decide wether you would like to invest in a startup. So you are evaluating these comments"},{"role":"user","content":""}]}`

/*
This variable stores the question that will be used in the OpenAI request for the "eli5" model.
*/
const questionEli5 =
  'The following text describes a programming project that is currently in development. Explain to me what the project is trying to achieve without telling me how they are doing so. Please use around 50 words and do not get too technical'

/*
This variable stores the question that will be used in the OpenAI request for the "hackernews" model.
*/

const questionHackernews =
  'The following comments are discussing a new software project. Please get general sentiment regarding the project and use percentage on wether people like it or not. Please stay at arround 50 words'

/*
This async function sends a request to the OpenAI API for the "eli5" model
and returns the content of the response. It takes a readME parameter, which should be 
the text to be processed by ChatGPT. The request body is updated with the question and the text, 
and the API call is made using the fetch function. The response is parsed and the content of the response message is returned.
*/

async function openAIRequestEli5(readME: string) {
  const jsonRequestBody = JSON.parse(request_body_Eli5) as RequestBodyOpenAI
  jsonRequestBody.messages[1].content = questionEli5

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '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' // process.env.OPENAI_API_KEY
      },
      method: 'POST',
      body: JSON.stringify(jsonRequestBody)
    })
    const data = (await response
      .json()
      .catch(() => console.log('not a json'))) as ResponseBodyOpenAi
    if (!data.choices[0]?.message?.content) {
      console.log(
        'The fetched response was empty. Most likely there is something wrong with the JSON request.'
      )
    } else {
      const content: string = data.choices[0].message.content
      return content
    }
  } catch {
    console.log('ai request did not work ')
    return null
  }
}

/*
This async function sends a request to the OpenAI API for the "hackernews" model and 
returns the content of the response. It takes a comments parameter, which should be a 
string containing comments to be processed by ChatGPT. The request body is updated with 
the question and the comments, and the API call is made using the fetch function. The response 
is parsed and the content of the response message is returned. 
*/

async function openAIRequestHackernews(comments: string) {
  const jsonRequestBody = JSON.parse(request_body_Hackernews) as RequestBodyOpenAI
  jsonRequestBody.messages[1].content = questionHackernews + ' ' + comments

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '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' // process.env.OPENAI_API_KEY
      },
      method: 'POST',
      body: JSON.stringify(jsonRequestBody)
    })
    console.log(response)
    console.log('in  2 ai')
    const data = (await response
      .json()
      .catch(() => console.log('not a json'))) as ResponseBodyOpenAi
    console.log(data)
    if (!data?.choices[0]?.message?.content) {
      console.log(
        'The fetched response was empty. Most likely there is something wrong with the JSON request.'
      )
      return null
    } else {
      const content: string = data?.choices[0]?.message?.content
      console.log(content)
      return content
    }
  } catch {
    console.log('openai request did not work out. ')
    return null
  }
}

export { openAIRequestHackernews }

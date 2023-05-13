interface RequestBody {
  model: string
  messages: {
    role: string
    content: string
  }[]
}
interface Response {
  id: string
  object: string
  created: number
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  choices: {
    message: Record<string, string>
    finish_reason: string
    index: number
  }[]
}
const request_body = `{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are a Computer Science Teacher talking to his students and the students do not have a deep technical understanding. So the teacher tries to stay simple"},{"role":"user","content":""}]}`

void openAIRequestTurbo()

async function openAIRequestTurbo() {
  const question =
    'The following text describes a programming project that is currently in development. Explain to me what the project is trying to achieve without telling me how they are doing so. Please use around 50 words and do not get too technical'

  const jsonRequestBody = JSON.parse(request_body) as RequestBody

  // jsonRequestBody.messages[1].content = question;
  let response: Response = new Response()
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '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' // process.env.OPENAI_API_KEY
      },
      method: 'POST',
      body: JSON.stringify(jsonRequestBody)
    }).catch((): Response => {
      console.log('klappt nicht')
      return new Response()
    })
    const data = (await response.json().catch(() => console.log('not a json'))) as Response
    if (!data.choices[0]?.message?.content) {
      console.log(
        'The fetched response was empty. Most likely there is something wrong with the JSON request.'
      )
    } else {
      const content: string = data.choices[0].message.content
      console.log(content)
    }
  } catch (error) {
    console.log('An error occurred:', error)
  }
}

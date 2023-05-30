import axios from 'axios'
import { RequestBodyOpenAI, ResponseBodyOpenAi} from '../../types/openAIApi'
require('dotenv').config();

/**
 * The JSON request body for the requests 
 */

const model = 'gpt-3.5-turbo'

const request_body_Eli5 = {
  model: model,
  messages: [
    { role: 'system', content: 'You are a Computer Science Teacher talking to his students and the students do not have a deep technical understanding. So the teacher tries to stay simple' },
    { role: 'user', content: '' }
  ]
};

const request_body_Hackernews = {
  model: model,
  messages: [
    { role: 'system', content: 'You are trying to decide whether you would like to invest in a startup. So you are evaluating these comments' },
    { role: 'user', content: '' }
  ]
};

const request_body_Categories = {
  model: model,
  messages: [
    { role: 'system', content: 'You are a professor trying to categorize a project. You have to read something about the project and then give it two of the categories according to your evaluation. Even if you do not think that you can evaluate it. Just do it to the best of your abilities' },
    { role: 'user', content: '' }
  ]
};

// Define the headers, including the API key
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' +process.env.openaikey;
};



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
const questionCategoriesSpecific=
  'These categroies should be used to categorize a software engineering project. Please use the following Text which can either be a read me or just words which are used to describe the project. Please choose two of the  categories I provided in the beginning that describe this project the best based on these words or readmereadme (Your response should only consist of the two words you choose. So your Response should only cosist of exactly two words seperated by a comma): '


/**
 * The question prompt for the categories 
 */
const questionCategoriesGeneral=
  'These 3 categroies should be used to categorize a software engineering project. 1 for developer tools, 2 for Infrastructure, 3 for Machine Learning and Artifical Inteligence. Apart from the number do not respond with anything): '




  /**
   * The URL used to request the Response
   */
  const postURL =  'https://api.openai.com/v1/chat/completions'





  const errorMessage = " The fetched response was empty. Most likely there is something wrong with the JSON request. "
/**
 * Send a request to the ELI5 OpenAI API to generate a response.
 * @param readME - The text to be explained.
 * @returns The generated explanation from the ELI5 API.
 */
async function getELI5DescriptionForRepositoryFromText(readME: string) {
  
 // const jsonRequestBody = JSON.parse(request_body_Eli5) as RequestBodyOpenAI
  request_body_Eli5.messages[1].content = questionEli5 +readME
  console.log( request_body_Eli5)
  try {
    const response = await axios.post( postURL,request_body_Eli5,{headers})

    const data = response.data as ResponseBodyOpenAi
    if (!data?.choices[0]?.message?.content) {
      console.log(
       errorMessage
      )
      return null
    } else {
      const content: string = data.choices[0].message.content
      console.log(content)
      return content
    }
  } catch (error) {
    console.log( error)
    return null
  }
}

/**
 * Send a request to the Hackernews OpenAI API to generate a response.
 * @param comments - The comments to be evaluated.
 * @returns The generated response from the Hackernews API.
 */
async function getSentimentForProjectFromHackernewsComments(comments: string) {

  request_body_Hackernews.messages[1].content = questionHackernews + ' ' + comments

  try {
    const response = await axios.post(postURL,request_body_Hackernews,{headers})

    const data = response.data as ResponseBodyOpenAi
    if (!data?.choices[0]?.message?.content) {
      console.log(
        errorMessage
      )
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

async function categorizeProjectSpecific(readMeOrCategory: string, categoryGeneral: number) {

  const listOfCategoriesDeveloperTools: string[] = [
    'Code Editors',
    'Version Control',
    'Continuous Integration',
    'Testing Frameworks',
    'Package Managers',
    'Integrated Development Environments',
    'Debuggers',
    'Profilers',
    'Build Tools',
    'Code Quality',
  ];
  
  const listOfCategoriesInfrastructure: string[] = [
    'Cloud Computing',
    'Virtualization',
    'Containerization',
    'Orchestration',
    'Monitoring',
    'Networking',
    'Databases',
    'Load Balancing',
    'Content Delivery Networks',
    'Identity Management',
  ];
  
  const listOfCategoriesMLAI: string[] = [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Cybersecurity'
  ];
switch (categoryGeneral) {
  case 1:
    request_body_Categories.messages[1].content =  listOfCategoriesDeveloperTools.join(" ,") + questionCategoriesSpecific + readMeOrCategory 
    break;
  case 2:
    request_body_Categories.messages[1].content =  listOfCategoriesInfrastructure.join(" ,") + questionCategoriesSpecific + readMeOrCategory 

    break;
  case 3:
    request_body_Categories.messages[1].content =  listOfCategoriesMLAI.join(" ,") + questionCategoriesSpecific + readMeOrCategory 

    break;
  default:
    console.log("error in categorizeProjectSpecific");
    break;
}
  try {
    const response = await axios.post(postURL,request_body_Categories,{headers})

    const data = response.data as ResponseBodyOpenAi
    if (!data?.choices[0]?.message?.content) {
      console.log(
        errorMessage
      )
      return null
    } else {
      const content: string = data?.choices[0]?.message?.content
      return content
    }
  } catch (error) {
    console.log('AI request did not work: ', error)
    return null
  }
}

//returns a number for the category. 1 for developer tools, 2 for infrastucture and 3 for ML/AI


async function categorizeProjectGeneral(readMeOrCategory: string) {
  const listOfCategories: string[] = ['Developer Tools','Infrastrcuture','Machine Learning and Aritfical Inteligence'];
  request_body_Categories.messages[1].content =  listOfCategories.join(" ,") + questionCategoriesGeneral + readMeOrCategory 
  try {
    const response = await axios.post(postURL,request_body_Categories,{headers})

    const data = response.data as ResponseBodyOpenAi
    if (!data?.choices[0]?.message?.content) {
      console.log(
        errorMessage
      )
      return null
    } else {
      const content: string = data?.choices[0]?.message?.content
        const num = parseInt(content)
        if(num!== 1 && num!== 2 && num !== 3){
          return "not enough information were prodivded, please use readme instead"
        }else{
        return categorizeProjectSpecific(readMeOrCategory,num)
        }
    }
  } catch (error) {
    console.log('AI request did not work: ', error)
    return null
  }
}



 

export { getELI5DescriptionForRepositoryFromText , categorizeProjectGeneral,getSentimentForProjectFromHackernewsComments }

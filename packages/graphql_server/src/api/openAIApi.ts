import axios from 'axios';
import { RequestBodyOpenAI, ResponseBodyOpenAi } from '../../types/openAIApi';

const model = 'gpt-3.5-turbo';
const postURL = 'https://api.openai.com/v1/chat/completions';
const errorMessage = 'The fetched response was empty. Most likely there is something wrong with the JSON request.';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
};

async function getELI5FromReadMe(readMe: string) {
  const questionEli5 =
    'The following text describes a programming project that is currently in development. Explain to me what the project is trying to achieve without telling me how they are doing so. Please use around 80 words and do not get too technical';

  const requestBodyEli5 = {
    model: model,
    messages: [
      { role: 'system', content: 'You are a Computer Science Teacher talking to his students and the students do not have a deep technical understanding. So the teacher tries to stay simple' },
      { role: 'user', content: questionEli5 + readMe }
    ]
  };

  try {
    const response = await axios.post(postURL, requestBodyEli5, { headers });
    const data = response.data as ResponseBodyOpenAi;

    if (!data?.choices[0]?.message?.content) {
      console.log(errorMessage);
      return null;
    } else {
      const content: string = data.choices[0].message.content;
      console.log(content);
      return content;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getHackernewsSentiment(comments: string) {
  const questionHackernews =
    'The following comments are discussing a new software project. Please get general sentiment regarding the project and use a percentage on whether people like it or not. Please stay around 50 words';

  const requestBodyHackernews = {
    model: model,
    messages: [
      { role: 'system', content: 'You are trying to decide whether you would like to invest in a startup. So you are evaluating these comments' },
      { role: 'user', content: questionHackernews + ' ' + comments }
    ]
  };

  try {
    const response = await axios.post(postURL, requestBodyHackernews, { headers });
    const data = response.data as ResponseBodyOpenAi;

    if (!data?.choices[0]?.message?.content) {
      console.log(errorMessage);
      return null;
    } else {
      const content: string = data.choices[0].message.content;
      return content;
    }
  } catch (error) {
    console.log('OpenAI request did not work out: ', error);
    return null;
  }
}

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
    'Cybersecurity',
  ];

  const questionCategoriesSpecific =
    'These categories should be used to categorize a software engineering project. Please choose two of the categories from the list that describe this project the best based on these words or readme (Your response should only consist of the two words you choose, separated by a comma): ';

  let categoriesSpecific: string[];
  switch (categoryGeneral) {
    case 1:
      categoriesSpecific = listOfCategoriesDeveloperTools;
      break;
    case 2:
      categoriesSpecific = listOfCategoriesInfrastructure;
      break;
    case 3:
      categoriesSpecific = listOfCategoriesMLAI;
      break;
    default:
      console.log('Invalid categoryGeneral value');
      return null;
  }

  const requestBodyCategories = {
    model: model,
    messages: [
      { role: 'system', content: 'You are a professor trying to categorize a project. You have to read something about the project and then give it two of the categories according to your evaluation. Even if you do not think that you can evaluate it. Just do it to the best of your abilities' },
      { role: 'user', content: categoriesSpecific.join(' ,') + questionCategoriesSpecific + readMeOrCategory }
    ]
  };

  try {
    const response = await axios.post(postURL, requestBodyCategories, { headers });
    const data = response.data as ResponseBodyOpenAi;

    if (!data?.choices[0]?.message?.content) {
      console.log(errorMessage);
      return null;
    } else {
      const content: string = data.choices[0].message.content;
      return content;
    }
  } catch (error) {
    console.log('AI request did not work: ', error);
    return null;
  }
}

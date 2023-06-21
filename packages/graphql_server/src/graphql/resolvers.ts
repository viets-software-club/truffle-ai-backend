/* eslint-disable @typescript-eslint/no-unsafe-call */
// @ts

import { MercuriusContext } from 'mercurius'
import { throwErrorWithCode } from '../util/util'
import DBUpdater from 'api'

type AddBookmarkArgs = {
  repositoryOwner: string
  repositoryName: string
}

const dbUpdater = new DBUpdater({
  scrapingBotApiKey: process.env.SCRAPING_BOT_API_KEY,
  scrapingBotUsername: process.env.SCRAPING_BOT_USER_NAME,
  openAiApikey: process.env.OPENAI_API_KEY,
  githubToken: process.env.GITHUB_API_TOKEN
})

const resolvers = {
  Query: {
    helloWorld: () => 'Hello world!'
  },
  Mutation: {
    addBookmark: async (
      _parent: unknown,
      { repositoryOwner, repositoryName }: AddBookmarkArgs,
      context: MercuriusContext
    ) => {
      if (!context.user) {
        return throwErrorWithCode('BAD', 'Bad')
      }
      await dbUpdater.addBookmark(repositoryOwner, repositoryName, context.user.id)
    }
  }
}

export default resolvers

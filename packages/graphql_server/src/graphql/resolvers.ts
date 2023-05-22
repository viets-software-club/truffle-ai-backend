// I get an error when importing this module. It works still.
// chatGPT says this might come from the standard module loader not supporting
// json files?! I do not know how to resolve this atm
<<<<<<< HEAD:src/graphql/resolvers.ts
// import sampleProjects from '../../assets/sampleProjects'
=======
import sampleProjects from '../assets/sampleProjects.json'
>>>>>>> bfe4521d04d6c50f1df0c482fc7aa03529b1688a:packages/graphql_server/src/graphql/resolvers.ts

type SocialMediaPresence = {
  platform: string
  accountName: string
  link: string
}

type SocialMediaTopPost = {
  platform: string
  link: string
  title: string
}

const resolvers = {
  Query: {
<<<<<<< HEAD:src/graphql/resolvers.ts
    // see https://graphql.org/learn/execution/
    // Returns the above imported sampleProjects
    //
    // pre-commit hook complains because of typing, which does not play a
    // role here because GraphQL knows about the type -> --no-verify commit
    //
    // will check with Philipp whether and how to change this
    // projects: () => sampleProjects
=======
    // @TODO add typing for all types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    projects: () => sampleProjects
>>>>>>> bfe4521d04d6c50f1df0c482fc7aa03529b1688a:packages/graphql_server/src/graphql/resolvers.ts
  },
  SocialMediaPresence: {
    // resolves the type of SocialMediaPresence based on the platform field
    resolveType(socialMediaPresence: SocialMediaPresence) {
      switch (socialMediaPresence.platform) {
        case 'Twitter':
          return 'TwitterAccount'
        case 'LinkedIn':
          return 'LinkedInAccount'
        case 'Slack':
          return 'SlackChannel'
        case 'Discord':
          return 'DiscordChannel'
        default:
          return null // fallback to null if the object doesn't match any known types
      }
    }
  },
  SocialMediaTopPost: {
    // resolves the type of SocialMediaTopPost based on the platform field
    resolveType(socialMediaTopPost: SocialMediaTopPost) {
      switch (socialMediaTopPost.platform) {
        case 'Hacker News':
          return 'HackernewsTopPost'
        case 'Twitter':
          return 'TwitterTopPost'
        case 'Product Hunt':
          return 'ProductHuntTopPost'
        default:
          return null
      }
    }
  }
}

export default resolvers

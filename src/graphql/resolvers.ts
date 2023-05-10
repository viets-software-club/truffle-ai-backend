type GitRepositoryQueryArgs = {
  id: string
}

type SocialMediaPresence = {
  platform: string
  accountName: string
  link: string
}

const repositories = [
  {
    id: '1',
    name: 'Repo1',
    stars: 5,
    contributors: ['pczern', 'coder']
  },
  {
    id: '2',
    name: 'Repo2',
    stars: 3,
    contributors: ['pczern', 'coder']
  }
]

const resolvers = {
  Query: {
    // see https://graphql.org/learn/execution/
    gitRepository: (obj: unknown, { id }: GitRepositoryQueryArgs) =>
      repositories.find((r) => r.id === id) ?? [],
    gitRepositories: () => repositories,
    projects: () => [sampleProject]
  },
  SocialMediaPresence: {
    // not working currently. I don't know why
    __resolveType(socialMediaPresence: SocialMediaPresence) {
      console.log(socialMediaPresence.platform)
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
  }
}

export default resolvers

const sampleProject = {
  id: '123',
  gitHubInformation: {
    name: 'Next.js',
    author: {
      gitHubHandle: 'vercel',
      name: 'vercel',
      repositoryCount: 145,
      starCount: 56838,
      employedAt: null,
      email: null,
      personalWebsite: 'https://vercel.co/',
      twitterHandle: '@vercel'
    },
    about: 'Next.js is a minimalistic framework for server-rendered React applications.',
    eli5: 'Next.js is a framework that simplifies building React applications that render on the server.',
    programmingLanguages: ['JavaScript', 'CSS', 'HTML'],
    categories: ['Web Framework'],
    starCount: 56317,
    issueCount: 531,
    forkCount: 4606,
    pullRequestCount: 444,
    contributorsCount: 245,
    topThreeContributors: [
      {
        gitHubHandle: 'developit',
        name: 'Jason Miller',
        repositoryCount: 128,
        starCount: 33595,
        employedAt: null,
        email: null,
        personalWebsite: 'https://jasonformat.com/',
        twitterHandle: '@_developit'
      },
      {
        gitHubHandle: 'timer150',
        name: 'Tim Neutkens',
        repositoryCount: 35,
        starCount: 5361,
        employedAt: 'Vercel',
        email: null,
        personalWebsite: null,
        twitterHandle: '@timneutkens'
      },
      {
        gitHubHandle: 'laurieontech',
        name: 'Laurie Barth',
        repositoryCount: 23,
        starCount: 323,
        employedAt: null,
        email: null,
        personalWebsite: 'https://www.laurieontech.com/',
        twitterHandle: '@laurieontech'
      }
    ],
    linkToRepo: 'https://github.com/vercel/next.js',
    websiteOfRepo: 'https://nextjs.org/'
  },
  socialMediaAccounts: [
    {
      platform: 'Twitter',
      accountName: 'Next.js',
      link: 'https://twitter.com/vercel'
    },
    {
      platform: 'LinkedIn',
      accountName: 'Next.js',
      link: 'https://www.linkedin.com/company/zeitco/'
    },
    {
      platform: 'Slack',
      accountName: '#next-js',
      link: 'https://vercel.com/chat'
    },
    {
      platform: 'Discord',
      accountName: 'Next.js',
      link: 'https://discord.gg/nextjs'
    }
  ],
  socialMediaTopPosts: [
    {
      platform: 'Hacker News',
      link: 'https://news.ycombinator.com/item?id=29490051',
      title:
        'Next.js 11.1: Faster Full-Stack Performance, Live Image Editing, Image Component, and more',
      pointCount: 453,
      commentCount: 154
    },
    {
      platform: 'Twitter',
      link: 'https://twitter.com/vercel/status/1390351807263238660',
      title:
        'Next.js 11.1 is here! 🎉\n\nThis release includes:\n\n- Faster full-stack performance 🚀\n- Live image editing in development 📸\n- A new &lt;Image&gt; component 💻\n- Custom domains for Vercel Preview 🌐\n- Improved component rendering speed ⚡️\n\nhttps://t.co/PGLLSMv8rY',
      date: '2021-05-06T14:11:22.000Z',
      likeCount: 573,
      commentCount: 69,
      retweetCount: 270,
      viewsCount: 15328
    },
    {
      platform: 'Product Hunt',
      link: 'https://www.producthunt.com/posts/next-js-11-1',
      title: 'Next.js 11.1 - Faster Full-Stack Performance, Live Image Editing, and More',
      descriptionPreview: 'Build your React apps faster and smarter',
      date: '2021-05-06T11:03:32.000Z',
      likeCount: 186,
      commentCount: 17
    }
  ]
}

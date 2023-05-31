export type TwitterUser = {
  profileName: string
  isVerified: boolean
  bio: string
  followers: number
  websiteUrl: string
  handle: string
  postsInfo: {
    text: string
    id: string
    replies: number
    retweets: number
    likes: number
    hashtags: string[]
    post_url: string
    owner_url: string
    media_type: string
    isRetweeted: boolean
  }[]
}

export type TwitterPost = {
  id: string
  text: string
  retweetCount: number
  likeCount: number
  replies: number
}

export type TwitterProfileResponse = {
  profile_name: string
  isVerified: boolean
  bio: string
  following: number
  followers: number
  website_url: string
  posts: number
  handle: string
  collected_number_of_posts: number
  posts_info: {
    text: string
    id: string
    replies: number
    retweets: number
    likes: number
    hashtags: string[]
    post_url: string
    owner_url: string
    media_type: string
    isRetweeted: boolean
  }[]
}

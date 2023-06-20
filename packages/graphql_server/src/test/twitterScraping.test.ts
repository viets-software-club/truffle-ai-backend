import { getPostsForHashtag, getPostsForHashtagSortedBy } from '../scraping/twitterScraping'

// Testfall 1: Gültiger Hashtag
void getPostsForHashtag('#typescript').then((posts) => console.log('Testfall 1:', posts))

// Testfall 2: Leerzeichen im Hashtag
void getPostsForHashtag('#open ai').then((posts) => console.log('Testfall 2:', posts))

// Testfall 3: Ungültiger Hashtag
void getPostsForHashtag('').then((posts) => console.log('Testfall 3:', posts))

// Testfall 4: Sonderzeichen im Hashtag
void getPostsForHashtag('#$%&').then((posts) => console.log('Testfall 4:', posts))

// Testfall 5: Hashtag mit Umlauten
void getPostsForHashtag('#München').then((posts) => console.log('Testfall 5:', posts))

// Testfall 6: Hashtag mit Zahlen
void getPostsForHashtag('#2023').then((posts) => console.log('Testfall 6:', posts))

const SORT_BY_RETWEETS = 'retweets'
const SORT_BY_REPLIES = 'replies'

// Testfall 1: Gültiger Hashtag, Sortieren nach Anzahl der Antworten
void getPostsForHashtagSortedBy('#javascript', SORT_BY_REPLIES).then((sortedPosts) =>
  console.log('Testfall 1:', sortedPosts)
)

// Testfall 2: Gültiger Hashtag, Sortieren nach Anzahl der Retweets
void getPostsForHashtagSortedBy('#python', SORT_BY_RETWEETS).then((sortedPosts) =>
  console.log('Testfall 2:', sortedPosts)
)

// Testfall 3: Leerzeichen im Hashtag
void getPostsForHashtagSortedBy('#machine learning', SORT_BY_REPLIES).then((sortedPosts) =>
  console.log('Testfall 3:', sortedPosts)
)

// Testfall 4: Ungültiger Hashtag
void getPostsForHashtagSortedBy('', SORT_BY_RETWEETS).then((sortedPosts) =>
  console.log('Testfall 4:', sortedPosts)
)

// Testfall 5: ungültiger sort by
void getPostsForHashtagSortedBy('#$%&', 'undefined').then((sortedPosts) =>
  console.log('Testfall 5:', sortedPosts)
)

// Testfall 6: Hashtag mit Umlauten
void getPostsForHashtagSortedBy('#Köln', SORT_BY_RETWEETS).then((sortedPosts) =>
  console.log('Testfall 6:', sortedPosts)
)

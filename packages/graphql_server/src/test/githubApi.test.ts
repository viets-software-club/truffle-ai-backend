import { getRepositoryTopics, getContributorCount, getRepoFounders } from '../api/githubApi'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function testGetRepositoryTopics(repoFounder: string, repoName: string) {
  console.log(await getRepositoryTopics(repoFounder, repoName, process.env.GITHUB_API_TOKEN))
}

//test function that calls the method and prints out all contributors
export async function testGetContributorCount(owner: string, repo: string) {
  console.log(await getContributorCount(owner, repo, ' ')) //here we need to pass an auth token
}

// Testfall 1: Gültiger Repository-Name und -Besitzer
void getRepoFounders('vercel', 'next.js').then((founders) => console.log('Testfall 1:', founders))

// Testfall 2: Ungültiger Repository-Besitzer
void getRepoFounders('', 'myrepository').then((founders) => console.log('Testfall 2:', founders))

// Testfall 3: Ungültiger Repository-Name
void getRepoFounders('myusername', '').then((founders) => console.log('Testfall 3:', founders))

// Testfall 4: Keine Commit-Verlaufsdaten vorhanden
void getRepoFounders('akjdhsfakjsdfalksdfhja', 'akjdfhsaksdfaljkdhsfalkjdsf').then((founders) =>
  console.log('Testfall 4:', founders)
)

// Testfall 5: Keine Duplikate in den Commit-Autoren
void getRepoFounders('jst-seminar-rostlab-tum', 'truffle-ai-backend').then((founders) =>
  console.log('Testfall 5:', founders)
)

// Testfall 6: Keine Twitter-Benutzernamen in den Commit-Autoren
void getRepoFounders('', '').then((founders) => console.log('Testfall 6:', founders))

/*
testGetContributorCount('iv-org', 'invidious') //268
testGetContributorCount('microsoft', 'guidance') //98
testGetContributorCount('smol-ai', 'developer') //14
testGetContributorCount('sunner', 'ChatALL') //15
testGetContributorCount('google', 'comprehensive-rust') //155*/

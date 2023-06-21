// see https://graphql.org/learn/schema/
const schema = `
  type Query {
    helloWorld: String!
  }
  type Mutation {
    addBookmark(repositoryOwner: String!, repositoryName: String!): Response!
  }
`

export default schema

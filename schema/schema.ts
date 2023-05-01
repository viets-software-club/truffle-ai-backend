import { buildSchema } from "graphql";

// GraphQL schema
var schema = buildSchema(`
type Book {
  id: ID!
  title: String!
  author: String!
}

type Author {
  id: ID!
  name: String!
  books: [Book]!
}
`);
module.exports = schema;

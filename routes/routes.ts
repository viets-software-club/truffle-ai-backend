const _express = require('express');
const { graphqlHTTP } = require('express-graphql');
const typeDefs = require('../schema/schema');
const resolvers = require('../resolver/resolvers');
const queries = require("../queries/queries");

const router = _express.Router();

router.use(
  '/graphql/schema',
  graphqlHTTP({
    schema: typeDefs,
    graphiql: true,
  })
);

router.use(
  '/graphql/resolvers',
  graphqlHTTP({
    rootValue: resolvers,
    graphiql: true,
  })
);

router.use(
  '/graphql/queries',
  graphqlHTTP({
    queries: queries,
    graphiql: true,
  })
);

module.exports = router;

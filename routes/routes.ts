const _express = require('express');
const { graphqlHTTP } = require('express-graphql');
const typeDefs = require('../schema/schema');
const resolvers = require('../resolver/resolvers');

const router = _express.Router();

router.use(
  '/graphql',
  graphqlHTTP({
    schema: typeDefs,
    rootValue: resolvers,
    graphiql: true,
  })
);

module.exports = router;

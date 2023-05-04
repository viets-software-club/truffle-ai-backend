// See https://github.com/mercurius-js/mercurius-typescript/tree/master/examples
// for GraphQL with Typescript examples
import { FastifyInstance } from 'fastify'
import mercurius from 'mercurius'
import resolvers from './resolvers'
import schema from './schema'

const initGraphQL = (app: FastifyInstance) => {
  void app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true, // see http://localhost:3000/graphiql
    context: (req) => {
      // Return an object that will be available in your GraphQL resolvers
      return {
        user_id: req?.user?.id
      }
    }
  })
}

export default initGraphQL

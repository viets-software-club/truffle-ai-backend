import Fastify from 'fastify'
import * as dotenv from 'dotenv'
import initAuth from './auth'
import initGraphQL from './graphql'
import { getFastifyLogger } from './utils'
// init environment variables
dotenv.config()
// init server
const app = Fastify({
  logger: getFastifyLogger()
})
initGraphQL(app)
initAuth(app)

export default app

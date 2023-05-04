import fs from 'fs'
import path from 'path'
import {
  FastifyInstance,
  FastifyPluginCallback,
  RawServerDefault,
  FastifyTypeProvider,
  FastifyBaseLogger
} from 'fastify'
import fastifyPassport from '@fastify/passport'
import { fastifySecureSession } from '@fastify/secure-session'
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20'

type FastSecureSessionPluginCallback = FastifyPluginCallback<
  { key: Buffer; cookie: { path: string } },
  RawServerDefault,
  FastifyTypeProvider,
  FastifyBaseLogger
>

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    // TODO safe profile before calling callback
    done(undefined, profile)
  }
)

const initAuth = (app: FastifyInstance) => {
  fastifyPassport.use('google', googleStrategy)
  fastifyPassport.registerUserSerializer(async (user: { id: string }) => Promise.resolve(user.id))
  fastifyPassport.registerUserDeserializer(async (id) =>
    Promise.resolve({
      id,
      name: 'Max Mustermann'
    })
  )
  void app.register(fastifySecureSession as FastSecureSessionPluginCallback, {
    key: fs.readFileSync(path.join(__dirname, 'secret-key')),
    cookie: {
      path: '/'
    }
  })

  void app.register(fastifyPassport.initialize())
  void app.register(fastifyPassport.secureSession())
  app.get(
    'auth/google/callback',
    { preValidation: fastifyPassport.authenticate('google', { scope: ['profile'] }) },
    async (req, res) => res.redirect('/')
  )

  app.get('login', fastifyPassport.authenticate('google', { scope: ['profile'] }))

  app.get('/logout', async (req) => {
    await req.logout()
    return { success: true }
  })
}

export default initAuth

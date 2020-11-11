import 'reflect-metadata'
import { __prod__ } from './constants'
import { Client, Provider, ProviderAttributes, Review } from './entities'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import dotenv from 'dotenv'
import path from 'path'
import { createConnection } from 'typeorm'
import { ClientResolver, ProviderResolver, ReviewResolver } from './resolvers'

dotenv.config()

const main = async () => {
  //connect to postgresdb--
  const connection = await createConnection({
    type: 'postgres',
    database: 'goodlook',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Client, Provider, ProviderAttributes, Review],
  })

  //await connection.dropDatabase() //drop for testing
  await connection.runMigrations()

  //migrate...

  //Inital test for mikrorm
  //create test entity
  //const testUser = orm.em.create(Client, { firstName: 'TestUser'})

  //to postgresdb--
  //orm.em.persistAndFlush(testUser)

  //create express
  const app = express()
  const RedisStore = connectRedis(session)
  const redis = new Redis(process.env.REDIS_URL)
  const corsOptions = {
    origin: process.env.CORS_DEBUG, //change to production later...
    credentials: true,
  }
  app.set('trust proxy', 1)
  app.use(
    session({
      name: 'token',
      store: new RedisStore({
        client: redis,
        disableTouch: true, //redis session lasts forever...
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //cookie duration: 1 week
        httpOnly: true,
        sameSite: 'lax', //https://portswigger.net/web-security/csrf/samesite-cookies
        secure: true, //cookie in https always in production lol
        domain: __prod__ ? '.blondpony.com' : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ClientResolver, ProviderResolver, ReviewResolver],
      validate: false,
    }),
    introspection: true,
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
    context: ({ req, res }) => ({ req, res, redis }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: corsOptions,
  })

  app.listen(parseInt(process.env.PORT!), () => {
    console.log('server started on localhost:8080')
  })
}

main().catch((err) => {
  console.error(err)
})

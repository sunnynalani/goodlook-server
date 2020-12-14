import 'reflect-metadata'
import { __prod__ } from './constants'
import {
  Client,
  Provider,
  Review,
  FavoriteConnection,
  Follow,
} from './entities'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import dotenv from 'dotenv'
import path from 'path'
import { createConnection } from 'typeorm'
import {
  ClientResolver,
  ProviderResolver,
  ReviewResolver,
  FavoriteResolver,
  FollowResolver,
} from './resolvers'

dotenv.config() //grabbing env var

/**
 * This api uses:
 * postgresql, redis, typeorm, typegraphql to create the db
 *
 * postgresSQL------------------
 *
 * The postgreSQL dbms currently does not have any plugins installed
 *
 * However, it should install the postGIS plugin so that it allows the
 * storage of spatial objects in the DB
 *
 * This would allow us to make faster and easier queries for the location data
 * Furthermore, we could use Tiger Geocoder to remove the mapquest API's needs of
 * grabbing geocodes from given addresses (although mapquest works better)
 *
 * Redis---------------
 *
 * Redis is used to store the session data. It is an in-memory cache which allows for
 * super fast retrieval of these data. It is also scalable.
 *
 * typeORM---------------
 *
 * typeORM is an ORM using typescript. It maps the current specified data onto postgreSQL
 * mikroORM is another option. It has less documentation.
 *
 * There are flaws to using an ORM
 *
 * the developers don't know the underlying query that is generated
 * and it adds a techinically unecessary layer of abstraction ontop of the DB
 *
 * however, it is useful for this project because it allows us to create a
 * prototype for an app fairly easily and quickly
 * furthermore, some of these flaws can be mitigated using the queryBuilder and
 * other methods
 *
 * There are some things to note
 * typeORM isn't perfect and has some flaws
 *
 * one major flaw is that there is some difficulty creating many-to-many relations
 * a workaround for these relations is to create another table joining the two entities
 * also, there might be parts of typeorm that are incompatible with typegraphql
 *
 * typegraphql---------------------
 * you can read about graphql online
 * basically it provides a single endpoint for the api
 * and it makes the experiance of querying things easier
 * main reason this layer was implemented was because of schema stitching
 * the n+1 problem can be worked around using queryBuilder or by implementing dataloader
 * there is alot more to this, but i reccommend reading the docs and researching
 */

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
    entities: [Client, Provider, Review, FavoriteConnection, Follow],
  })

  /**
   * I have not correctly set up migrations
   * Because it was unecessary at the current stage of development
   * TypeORM auto generates them
   */

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

  /**
   * This app uses session authentication using redis
   * I've made a sample of the JWT authentication in the middleware folder
   * if the requirements call for that instead
   *
   * I just didn't see a point of jwt authentication over sessions
   * since cookies also get stored in mobile apps
   */

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

  /**
   * Every time you add a new resolver
   * You MUST add it to the resolvers here
   *
   * The playground settings are important
   * Redis will not save the cookie to your browser
   * using playground unless you set the setting in the playground
   * to credentials: "include"
   */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        ClientResolver,
        ProviderResolver,
        ReviewResolver,
        FavoriteResolver,
        FollowResolver,
      ],
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

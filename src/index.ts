import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import dotenv from 'dotenv'
import { MyContext } from './types'
import { 
  TestResolver, 
  UserResolver,
} from './resolvers'

dotenv.config()

const main = async () => {
  //connect to postgresdb--
  const orm = await MikroORM.init(microConfig)

  //migrate...
  await orm.getMigrator().up()

  //Inital test for mikrorm
    //create test entity
    //const testUser = orm.em.create(Client, { firstName: 'TestUser'})

    //to postgresdb--
  //orm.em.persistAndFlush(testUser)


  //create express
  const app = express()
  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ 
        client: redisClient,
        disableTouch: true, //redis session lasts forever...
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, //cookie duration: 1 year
        httpOnly: true,
        sameSite: 'lax', //https://portswigger.net/web-security/csrf/samesite-cookies
        secure: __prod__ // cookie in https
      },
      saveUninitialized: false,
      secret: String(process.env.SESSION_SECRET),
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
  })

  apolloServer.applyMiddleware({ app })

  app.listen(5000, () => {
    console.log('server started on localhost:5000')
  })

}

main()
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { TestResolver } from './resolvers/test'

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
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver],
      validate: false
    }),
    context: () => ({ em: orm.em })
  })

  apolloServer.applyMiddleware({ app })

  app.listen(5000, () => {
    console.log('server started on localhost:5000')
  })

}

main()
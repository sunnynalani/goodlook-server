import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import { Client } from './entities/Client'
import microConfig from './mikro-orm.config'

const main = async () => {
  console.log(microConfig)
  const orm = await MikroORM.init(microConfig)

  //create test entity
  const testUser = orm.em.create(Client, { firstName: 'TestUser'})
  //to sql--
  console.log(testUser)
  orm.em.persistAndFlush(testUser)
}

main()
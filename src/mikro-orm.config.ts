import * as entities from './entities'
import { __prod__ } from './constants'
import { MikroORM } from '@mikro-orm/core'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: Object.values(entities),
  dbName: 'goodlook',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]
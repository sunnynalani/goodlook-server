import { Request, Response } from 'express'
import { Redis } from 'ioredis'

/**
 * This is the context type for the express server
 * Add more contexts if needeed
 */

export type MyContext = {
  req: Request & { session: Express.Session } //always defined session... otherwise session!
  res: Response
  redis: Redis
  payload?: any
}

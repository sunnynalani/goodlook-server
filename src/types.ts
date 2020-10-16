import { Request, Response } from 'express'
import { Redis } from 'ioredis'

export type MyContext = {
  req: Request & { session: Express.Session } //always defined session... otherwise session!
  res: Response
  redis: Redis
}
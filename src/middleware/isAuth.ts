import { MyContext } from 'src/types'
import { MiddlewareFn } from 'type-graphql'
import dotenv from 'dotenv'
import { verify } from 'jsonwebtoken'
dotenv.config()

//I was going to use jwt, but I changed my mind...
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const auth = context.req.headers['authorization']

  if (!auth) {
    throw new Error('not authenticated')
  }

  try {
    const token = auth.split('')[1]
    const payload = verify(token, process.env.SESSION_SECRET!)
    context.payload = payload
  } catch (err) {
    console.log(err)
    throw new Error('not authenticated')
  }
  return next() //tells us that middleware logic is complete
}

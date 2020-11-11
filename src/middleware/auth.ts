import { sign } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

//should work for both client and provider :p
export const createAccessToken = (user: any) => {
  return sign({ userId: user.id }, process.env.SESSION_SECRET!, {
    expiresIn: '1h',
  })
}

export const refreshAccessToken = (user: any) => {
  return sign({ userId: user.id }, process.env.REFRESH_SECRET!, {
    expiresIn: '7d',
  })
}

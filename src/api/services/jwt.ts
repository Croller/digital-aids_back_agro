import moment from 'moment'
import jwt from 'jsonwebtoken'
import { setError } from '@api/utils/error'
import { db } from '@api/services/db'
import { type TUser } from '@api/types/user'
import { type TRequest } from '@api/types/http'

const signature = process.env.SERVER_AUTH_SECRET ?? ''
const expiration = process.env.SERVER_AUTH_TIME ?? '0'
const expireTime = parseInt(expiration) * 60 * 60

const getToken = (source: string): string | null => {
  if (source.includes('Bearer ')) {
    const [, token] = source.split(' ')
    return token.length > 0 ? token : null
  }
  return source
}

export const decodeToken = (source: string): any | null => {
  const token = getToken(source)

  if (!token) {
    setError('tokenNotExist', 'Token not exist')
    return null
  }

  try {
    const data = jwt.verify(token, signature)
    return data
  } catch (err: any) {
    setError('tokenNotValid', 'Token not valid', JSON.stringify(err.message))
    return null
  }
}

export const generateToken = (source: TUser): string => {
  return jwt.sign(source, signature, { expiresIn: expiration })
}

export const verifyToken = async (req: TRequest): Promise<TUser | null> => {
  const userToken: TUser | null = req.headers.authorization ? decodeToken(req.headers.authorization) : null

  if (!userToken) {
    setError('tokenError', 'Token decode or not found error')
    return null
  }

  const isExpired = moment().diff(moment(userToken.enter_at, 'YYYY-MM-DDTHH:mm:ss.SSS'), 'seconds') > expireTime

  if (isExpired) {
    setError('tokenIsExpired', 'Token is expired')
    return null
  }

  try {
    const { id, login } = userToken
    const [user] = await db('auth.data_user').where({ id, login })

    if (!user) {
      setError('userNotFound', 'User not found')
      return null
    }

    return user
  } catch (err: any) {
    setError('queryError', 'Query error', JSON.stringify(err.message))
    return null
  }
}

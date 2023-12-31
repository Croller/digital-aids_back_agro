import moment from 'moment'
import jwt from 'jsonwebtoken'
import { setError } from '@api/utils/error'
import { db } from '@api/services/db'
import { type TUser } from '@api/types/user'
import { type TRequest } from '@api/types/http'
import { type Response } from 'express'

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

export const verifyToken = async (req: TRequest, res: Response): Promise<TUser | null> => {
  const userDecode: TUser | null = req.headers.authorization ? decodeToken(req.headers.authorization) : null

  if (!userDecode) {
    res.status(201).json(setError('authError', 'Token decode or not found error'))
    return null
  }

  const isExpired = moment().diff(moment(userDecode.enter_at, 'YYYY-MM-DDTHH:mm:ss.SSS'), 'seconds') > expireTime

  if (isExpired) {
    res.status(201).json(setError('authError', 'Token is expired'))
    return null
  }

  try {
    const { id, login } = userDecode
    const [user] = await db('auth.data_user').where({ id, login })

    if (!user || user.is_deleted) {
      res.status(201).json(setError('authError', 'User not found'))
      return null
    }

    return user
  } catch (err: any) {
    setError('authError', 'Query error', JSON.stringify(err.message))
    return null
  }
}

import { db } from '@api/services/db'
import { generateToken, verifyToken } from '@api/services/jwt'
import { setError } from '@api/utils/error'
import { logger } from '@api/utils/logger'
import { type Response, Router } from 'express'
import { type TRequest } from '@api/types/http'
import { type TUser, type TRule } from '@api/types/user'

export const user_routes = Router()

const APP = process.env.APP_NAME ?? ''
const passwordMask = '*******'

const auth = async (req: TRequest, res: Response): Promise<void> => {
  const user = await verifyToken(req, res)
  if (!user) return

  try {
    await logger('auth.data_user', { id: user.id }, user)
    const enter_at_new = { enter_at: new Date().toISOString() }
    const rules: TRule[] = await db(`${APP}.data_rules`).where({ user_id: user.id })
    const [updatedUser]: TUser[] = await db('auth.data_user').where({ id: user.id, is_deleted: false }).update(enter_at_new).returning('*')
    const { id, login, enter_at } = updatedUser
    updatedUser.password = passwordMask
    const token = generateToken({ id, login, enter_at })
    res.json({ user: updatedUser, token, rules })
  } catch (err: any) {
    res.status(201).json(setError('queryError', 'Query error', JSON.stringify(err.message)))
  }
}

user_routes.get('/auth', auth)

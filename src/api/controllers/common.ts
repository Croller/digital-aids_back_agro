import { db } from '@api/services/db'
import { setError } from '@api/utils/error'
import { verifyToken } from '@api/services/jwt'
import { type Response, Router } from 'express'
import { type TRequest } from '@api/types/http'

export const common_routes = Router()

const APP = process.env.APP_NAME ?? ''

const getDictionary = async (req: TRequest, res: Response): Promise<void> => {
  if (!await verifyToken(req, res)) return

  if (!req.params?.table || !['dictionary_', 'enum_'].some((str: string) => req.params?.table && req.params?.table.includes(str))) {
    res.status(201).json(setError('queryError', 'Query error'))
    return
  }

  try {
    const { table } = req.params
    const name = table.split('_')[1]
    const results = await db(`${APP}.${table}`)

    res.json({ [`${name}`]: results })
  } catch (err: any) {
    res.status(201).json(setError('queryError', 'Query error', JSON.stringify(err.message)))
  }
}

common_routes.get(`/api/${APP}/dictionary/:table`, getDictionary)

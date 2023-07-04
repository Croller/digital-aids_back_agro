import { verifyToken } from '@api/services/jwt'
import { setError } from '@api/utils/error'
import { getLanguage } from '@api/utils/headers'
import { type Response, Router } from 'express'
import { type TRequest } from '@api/types/http'

export const openweather_routes = Router()

const APP = process.env.APP_NAME ?? ''
const API_URL = 'https://api.openweathermap.org/data/2.5'

const current = async (req: TRequest, res: Response): Promise<void> => {
  if (!await verifyToken(req, res)) return

  if (!req.query?.x || !req.query?.y) {
    res.status(201).json(setError('confirmError', 'Confirm error'))
    return
  }

  try {
    const { x, y, units } = req.query
    const apiKey = process.env.API_KEY_OPENWEATHER ?? ''
    const lng = getLanguage(req)
    const url = `${API_URL}/weather?lat=${x}&lon=${y}&units=${units ?? 'metric'}&lang=${lng}&appid=${apiKey}`
    const response = await fetch(url)
    const result = await response.json()
    res.json(result)
  } catch (err: any) {
    res.status(201).json(setError('queryError', 'Query error', JSON.stringify(err.message)))
  }
}

const forecast = async (req: TRequest, res: Response): Promise<void> => {
  if (!await verifyToken(req, res)) return

  if (!req.query?.x || !req.query?.y) {
    res.status(201).json(setError('confirmError', 'Confirm error'))
    return
  }

  try {
    const { x, y, cnt, units } = req.query
    const apiKey = process.env.API_KEY_OPENWEATHER ?? ''
    const lng = getLanguage(req)
    const url = `${API_URL}/forecast?lat=${x}&lon=${y}&cnt=${cnt ?? 7}&units=${units ?? 'metric'}&lang=${lng}&appid=${apiKey}`
    const response = await fetch(url)
    const result = await response.json()
    res.json(result)
  } catch (err: any) {
    res.status(201).json(setError('queryError', 'Query error', JSON.stringify(err.message)))
  }
}

openweather_routes.get(`/api/${APP}/weather/current`, current)
openweather_routes.get(`/api/${APP}/weather/forecast`, forecast)

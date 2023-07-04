import express from 'express'
import { user_routes } from './controllers/user'
import { openweather_routes } from './controllers/openweather'

export const routes = express.Router()

routes.use(user_routes)
routes.use(openweather_routes)

import express from 'express'
import { user_routes } from './controllers/user'
import { field_routes } from './controllers/field'
import { openweather_routes } from './controllers/openweather'
import { common_routes } from './controllers/common'

export const routes = express.Router()

routes.use(user_routes)
routes.use(field_routes)
routes.use(openweather_routes)
routes.use(common_routes)

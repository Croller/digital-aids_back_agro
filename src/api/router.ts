import express from 'express'
import { user_routes } from '@api/controllers/user'
import { field_routes } from '@api/controllers/field'
import { openweather_routes } from '@api/controllers/openweather'
import { common_routes } from '@api/controllers/common'
import { swagger_routes } from '@api/controllers/swagger'

export const routes = express.Router()
export const swagger = swagger_routes

routes.use(user_routes)
routes.use(field_routes)
routes.use(openweather_routes)
routes.use(common_routes)

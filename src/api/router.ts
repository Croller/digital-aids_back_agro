import express from 'express'
import { user_routes } from './controllers/user'
import { common_routes } from './controllers/common'

export const routes = express.Router()

routes.use(user_routes)
routes.use(common_routes)

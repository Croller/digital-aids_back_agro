import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import basicAuth from 'express-basic-auth'
import swaggerDocument from '@api/swagger.json'

export const swagger_routes = Router()

const SWAGGER_LNG = process.env.SWAGGER_LNG ?? ''
const SWAGGER_PWD = process.env.SWAGGER_PWD ?? ''

const auth = basicAuth({
  users: { [SWAGGER_LNG]: SWAGGER_PWD },
  challenge: true
})

swagger_routes.use('/', auth, swaggerUi.serve, swaggerUi.setup(swaggerDocument))

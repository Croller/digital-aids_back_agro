import 'dotenv/config.js'
import swaggerAutogen from 'swagger-autogen'

const isDev = process.env.NODE_ENV === 'development'
const APP = process.env.APP_NAME ?? ''
const IP = process.env.LOCAL_IP ?? ''
const PORT = process.env.LOCAL_PORT ?? ''
const HOST = process.env.LOCAL_PORT ?? ''
const outputFile = 'src/api/swagger.json'
const endpointsFiles = [
  'src/api/controllers/user.ts',
  'src/api/controllers/field.ts',
  'src/api/controllers/openweather.ts',
  'src/api/controllers/common.ts'
]
const doc = {
  info: {
    title: `Doc Api - ${APP.toUpperCase()}`
  },
  host: isDev ? `${IP}:${PORT}` : HOST,
  basePath: `/api/${APP}/`,
  schemes: isDev ? ['http'] : ['https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      scheme: 'bearer'
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
}

swaggerAutogen(outputFile, endpointsFiles, doc)

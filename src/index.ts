import 'dotenv/config.js'
import { Server } from 'http'
import express, { type Express } from 'express'
import { routes, swagger } from '@api/router'
import { createSocket } from '@api/services/socket'

const app: Express = express()
const http = new Server(app)
const NODE_ENV = process.env.NODE_ENV ?? ''
const APP = process.env.APP_NAME ?? ''
const LOCAL_PORT = process.env.LOCAL_PORT ?? ''

app.disable('x-powered-by')
app.use((_, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store')
  res.set('Pragma', 'no-cache')
  res.set('Expires', 'Mon, 31-Dec-1979 00:00:00 GMT')
  res.set('Content-Security-Policy', "default-src 'self'")
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
})
app.use(express.json({ limit: '550mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('src/static', { maxAge: 86400000 }))
app.use('/static', express.static('src/static'))
app.use(`/api/${APP}`, routes)
app.use(`/swagger/${APP}`, swagger)

http.listen(process.env.LOCAL_PORT)
createSocket(http)

console.log(`Env mode: ${NODE_ENV}`)
console.log(`Server port: ${LOCAL_PORT}`)

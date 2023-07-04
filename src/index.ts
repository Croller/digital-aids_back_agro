/* eslint-disable import/first */
import { Server } from 'http'
import { config } from 'dotenv'
import express, { type Express } from 'express'
import cors from 'cors'

config()

// for read env before import another file
import { routes } from '@api/router'
import { createSocket } from '@api/services/socket'

const app: Express = express()
const http = new Server(app)
const mode = process.env.NODE_ENV ?? ''
const port = process.env.LOCAL_PORT ?? ''

// for disable tls auth
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}))
app.use(express.json({ limit: '550mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('src/static', { maxAge: 86400000 }))
app.use('/static', express.static('src/static'))
app.use('/', routes)

http.listen(process.env.LOCAL_PORT)
createSocket(http)

console.log(`Env mode: ${mode}`)
console.log(`Server port: ${port}`)

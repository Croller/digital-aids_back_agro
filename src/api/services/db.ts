import knexjs from 'knex'
import knexGisjs from 'knex-postgis'
import { Client } from 'pg'

const isDev = process.env.NODE_ENV === 'development'
const port = process.env.HOST_DB_PORT ?? ''

const CONFIG = {
  user: process.env.HOST_DB_LOGIN,
  password: process.env.HOST_DB_PASSWORD,
  host: process.env.HOST_DB_HOST,
  port: Number(process.env.HOST_DB_PORT),
  database: process.env.HOST_DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
}

const pg = new Client(CONFIG)
pg.connect()
  .then(() => { console.log(isDev ? `DataBase port: ${port}` : 'DataBase: connected') })
  .catch((err) => { console.log('DataBase connect error:', err.qmessage) })

export const db = knexjs({
  client: 'pg',
  connection: CONFIG,
  pool: {
    propagateCreateError: false
  },
  // debug: true,
  log: {
    warn (message: string) {
      console.log('warn', message)
    },
    error (message: string) {
      console.log('error', message)
    },
    deprecate (message: string) {
      console.log('deprecate', message)
    },
    debug (message: string) {
      console.log('debug', message)
    }
  }
})

export const db_gis = knexGisjs(db)

import { db } from '@api/services/db'
import { setError } from './error'

import { type TUser } from '@api/types/user'

const isTable = async (table_name: string, table_schema = 'public'): Promise<boolean> => {
  const results = await db('information_schema.tables').where({ table_schema, table_name }).returning('*')
  return results.length === 1
}

export const logger = async (table: string, query: object, user: TUser): Promise<void> => {
  try {
    if (!table.includes('data_')) return
    const logsTable = table.replace('data_', 'logs_')
    const [table_schema, table_name] = logsTable.split('.')
    const existTable = await isTable(table_name, table_schema)

    if (!existTable) return
    const [filtred] = await db(table).where(query)

    if (filtred) return
    const data_db = {
      ...filtred,
      change_user: user.id,
      change_at: new Date().toISOString()
    }
    await db(logsTable).insert(data_db)
  } catch (err: any) {
    setError('loggerError', 'Logger error', JSON.stringify(err.message))
  }
}

import { db, db_gis } from '@api/services/db'
import { verifyToken } from '@api/services/jwt'
import { setError } from '@api/utils/error'
import { logger } from '@api/utils/logger'
import { type Response, Router } from 'express'
import { type TRequest } from '@api/types/http'
import { type TField } from '@api/types/field'

export const field_routes = Router()

const APP = process.env.APP_NAME ?? ''

const create = async (req: TRequest, res: Response): Promise<void> => {
  const user = await verifyToken(req, res)
  if (!user) return

  if (!req.body?.group_field || !req.body?.fields) {
    res.status(201).json(setError('fieldCreateError', 'Field create error'))
    return
  }

  try {
    const { group_field, fields } = req.body
    const [group] = await db(`${APP}.data_group_field`).insert({
      ...group_field,
      user_id: user.id
    }).returning('*')
    let result = await Promise.allSettled(fields.map(async (field) => {
      const editedFiled = field.properties as TField
      delete editedFiled.DN
      const [fld] = await db(`${APP}.data_field`).insert({
        ...field.properties,
        group_id: group.id,
        geom: db_gis.geomFromGeoJSON(field.geometry as any)
      }).returning('*')
      return fld
    }))
    result = result.map(r => r.status === 'fulfilled' && r.value).filter(f => f && f)

    await logger(`${APP}.data_group_field`, { id: group.id }, user)

    res.json({ group_field: group, fields: result })
  } catch (err: any) {
    res.status(201).json(setError('queryError', 'Query error', JSON.stringify(err.message)))
  }
}

const select = async (req: TRequest, res: Response): Promise<void> => {
  const user = await verifyToken(req, res)
  if (!user) return

  try {
    const group_field = await db(`${APP}.data_group_field`)
    let fields = await db.raw(
      `SELECT jsonb_build_object('type', 'Feature',
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(row) - 'geom'
      ) FROM (SELECT * FROM ${APP}.data_field) row;`
    )
    fields = fields.rows.map((item: any) => item.jsonb_build_object)
    res.json({ group_field, fields })
  } catch (err: any) {
    res.status(201).json(setError('queryError', 'Query error', JSON.stringify(err.message)))
  }
}

field_routes.put(`/api/${APP}/field/create`, create)
field_routes.get(`/api/${APP}/field/select`, select)

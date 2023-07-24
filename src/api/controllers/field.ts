import { db, db_gis } from '@api/services/db'
import { verifyToken } from '@api/services/jwt'
import { setError } from '@api/utils/error'
import { logger } from '@api/utils/logger'
import { type Response, Router } from 'express'
import { type TRequest } from '@api/types/http'
import { type TGroupField, type TField } from '@api/types/field'

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
    const [group]: TGroupField[] = await db(`${APP}.data_group_field`).insert({
      ...group_field,
      user_id: user.id
    }).returning('*')
    await Promise.allSettled(fields.map(async (field) => {
      const editedFiled = field.properties as TField
      delete editedFiled.DN
      const [fld] = await db(`${APP}.data_field`).insert({
        ...field.properties,
        group_id: group.id,
        geom: db_gis.geomFromGeoJSON(field.geometry as any)
      }).returning('*')
      return fld
    }))
    let result = await db.raw(
      `SELECT jsonb_build_object('type', 'Feature',
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(row) - 'geom'
      ) FROM (SELECT * FROM ${APP}.data_field WHERE group_id='${group.id}') row;`
    )
    result = result.rows.map((item: { jsonb_build_object: object }) => item.jsonb_build_object)

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
    const group_fields = await db(`${APP}.data_group_field`).where({ user_id: user.id, is_deleted: false })
    const groudIds = group_fields.map(g => g.id)
    let fields = await db.raw(
      `SELECT jsonb_build_object('type', 'Feature',
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(row) - 'geom'
      ) FROM (SELECT * FROM ${APP}.data_field WHERE group_id = any(:x1::uuid[]) AND is_deleted=:x2) row;`,
      { x1: groudIds, x2: false }
    )
    fields = fields.rows.map((item: { jsonb_build_object: object }) => item.jsonb_build_object)
    res.json({ group_fields, fields })
  } catch (err: any) {
    res.status(201).json(setError('queryError', 'Query error', JSON.stringify(err.message)))
  }
}

field_routes.put('/field/create', create)
field_routes.get('/field/select', select)

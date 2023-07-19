export type TGroupField = {
  id: string
  user_id: string
  name: string
  is_deleted: boolean
}

export type TField = {
  [x: string]: any
  id: string
  group_id?: string
  name: string
  culture_key: string
  culture_desc: string
  square: number
  ndvi: number
  geom: any
  is_deleted: string
}

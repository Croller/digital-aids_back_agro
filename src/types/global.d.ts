declare type TError = {
  key: string
  name: string
  desc: string | null
}

declare type TLogger = {
  change_user: string
  change_at: string
}

declare type TDictionary = {
  id: number
  name: string
}

declare type TSocketChange = {
  id: string
  type: 'create' | 'update' | 'delete'
  name: string
  data: object
}

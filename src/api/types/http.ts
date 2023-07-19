import { type TSignIn, type TUser } from '@api/types/user'
import { type TWeather, type TOWCurrent, type TOWForecast } from './openweather'
import { type TGroupField } from './field'
import { type TFeature } from './geojson'

export type THeaders = {
  authorization?: string
  'accept-language'?: string
  'x-forwarded-for'?: string
}

export type TRequest = {
  headers: THeaders
  connection?: {
    remoteAddress?: string
  }
  body: {
    signin?: TSignIn
    group_field?: TGroupField
    field?: TFeature
    fields?: TFeature[]
  }
  params?: {
    table?: string
  }
  query?: TWeather
}

export type TResponse = {
  token?: string
  user?: TUser
  error?: TError | null
  success?: boolean
  weather?: TOWCurrent | TOWForecast
}

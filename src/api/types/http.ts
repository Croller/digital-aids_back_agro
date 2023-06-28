import { type TSignIn, type TUser } from '@api/types/user'

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
    user?: TUser
    signin?: TSignIn
    data?: TUser
    rule?: {
      user_id: string
      name: string
    }
  }
  params?: {
    id?: string
    table?: string
    confirm?: string
    x?: string
    y?: string
    z?: string
    key?: string
  }
}

export type TResponse = {
  token?: string
  user?: TUser
  error?: TError | null
}

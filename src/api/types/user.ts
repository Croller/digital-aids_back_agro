export type TSignIn = {
  login: string
  password: string
}

export type TSignUp = TSignIn & {
  email: string
}

export type TUser = TSignUp & {
  id: string
  surname: string
  name: string
  middlename: string
  birthdate: string
  phone: string
  language: string
  enter_at: string
  is_deleted: boolean
}

export type TRule = {
  id: string
  name: string
  end_at: string
}

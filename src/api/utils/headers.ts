import { type TRequest } from '@api/types/http'

export const getLanguage = (req: TRequest): string => {
  if (!req.headers['accept-language']) return 'en'
  return req.headers['accept-language']
}

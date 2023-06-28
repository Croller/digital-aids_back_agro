import en from '@api/language/en.json'
import ru from '@api/language/ru.json'

type TObj = string

export type TLng = {
  en: TObj
  ru: TObj
}

export const getTranslate = (language: keyof TLng): TObj => {
  const lng: TLng = { en, ru }
  return lng[language] || lng.en
}

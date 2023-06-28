export const getRandomString = (length = 15): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  return [...Array(length).fill(null)].reduce((str: string) => `${str}${characters.charAt(Math.floor(Math.random() * charactersLength))}`, '')
}

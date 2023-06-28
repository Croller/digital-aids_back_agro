export const setError = (key: string, name: string, desc: string | null = null): { error: TError } => {
  const error = { key, name, desc }
  console.error('Error:', error)
  return { error }
}

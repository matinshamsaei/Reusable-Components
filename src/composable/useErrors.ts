export interface Error {
  data?: string
  errorCode?: number
  status?: number
  code?: number
}

export default (errors: Error | Error[] | null) => {
  if (errors && Array.isArray(errors)) {
    errors.forEach((error) => {
      if (typeof error === 'object') return throwError(error)
    })
  } else return throwError(errors)
}

const throwError = (error: Error | null): string | undefined => {
  if (error && error.data) throw new Error(error.data)

  return error?.data
}

import { Request } from 'express'

export const getTokenByRequest = (request: Request) => {
  let token = null
  if (request && request.headers.authorization) token = request.headers.authorization
  return token
}

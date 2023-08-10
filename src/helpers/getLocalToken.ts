import { LOCAL_TOKEN } from './../configs/tokens'
import { Request } from 'express'

export const getLocalToken = (request: Request) => {
  let token = null
  if (request && request.cookies) token = request.cookies[LOCAL_TOKEN]
  return token
}

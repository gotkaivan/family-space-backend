import { Request } from 'express'
import { LOCAL_TOKEN } from 'src/common/configs'

export const getTokenByRequest = (request: Request) => {
  let token = null
  if (request && request.cookies) token = request.cookies[LOCAL_TOKEN]
  return token
}

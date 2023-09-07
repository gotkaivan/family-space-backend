import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import config from '../config'
import { getTokenByRequest } from 'src/helpers'

const cookieExtractor = function (req) {
  return getTokenByRequest(req)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET,
    })
  }

  async validate(payload: { email: string }) {
    return { email: payload.email }
  }
}

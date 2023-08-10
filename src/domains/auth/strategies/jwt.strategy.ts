import { getLocalToken } from './../../../helpers/getLocalToken'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import config from '../config'

const cookieExtractor = function (req) {
  return getLocalToken(req)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // jwtFromRequest: cookieExtractor,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_SECRET,
    })
  }

  async validate(payload: { email: string }) {
    return { email: payload.email }
  }
}

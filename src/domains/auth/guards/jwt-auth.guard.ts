import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LOCAL_TOKEN } from 'src/common/configs'

@Injectable()
export class JwtAuthGuard extends AuthGuard(LOCAL_TOKEN) {}

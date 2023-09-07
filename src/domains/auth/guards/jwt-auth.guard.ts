import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LOCAL_TOKEN } from 'src/configs'

@Injectable()
export class JwtAuthGuard extends AuthGuard(LOCAL_TOKEN) {}

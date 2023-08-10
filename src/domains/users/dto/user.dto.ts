import { OmitType } from '@nestjs/swagger'
import { UserEntity } from '../entity/user.entity'

export class UserDto extends OmitType(UserEntity, ['password'] as const) {}

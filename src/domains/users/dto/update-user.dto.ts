import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { UserEntity } from '../entity/user.entity'

export class UpdateUserDto extends OmitType(UserEntity, ['password'] as const) {}

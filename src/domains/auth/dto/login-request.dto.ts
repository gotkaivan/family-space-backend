import { PickType } from '@nestjs/swagger'
import { UserEntity } from 'src/domains/users/entity/user.entity'

export class LoginRequestDto extends PickType(UserEntity, ['email', 'password'] as const) {}

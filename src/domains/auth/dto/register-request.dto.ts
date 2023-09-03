import { OmitType } from '@nestjs/swagger'
import { UserEntity } from 'src/domains/users/entity/user.entity'

export class RegisterRequestDto extends OmitType(UserEntity, ['id']) {}

import { ApiProperty } from '@nestjs/swagger'
import { UserDto } from 'src/domains/users/dto/user.dto'

export class AuthResponseDto {
  @ApiProperty({ description: 'Пользователь' })
  readonly user: UserDto

  @ApiProperty({ description: 'Токен' })
  readonly token: string
}

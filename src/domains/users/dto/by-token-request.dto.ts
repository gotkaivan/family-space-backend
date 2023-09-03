import { ApiProperty } from '@nestjs/swagger'

export class TokenDtoRequest {
  @ApiProperty({ description: 'Токен' })
  readonly accessToken: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class AttachBoardToUser {
  @ApiProperty({ description: 'ID пользователя' })
  @IsNumber()
  readonly userId: number

  @ApiProperty({ description: 'ID группы' })
  @IsNumber()
  readonly groupId: number
}

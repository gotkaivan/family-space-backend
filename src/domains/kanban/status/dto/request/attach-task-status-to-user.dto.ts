import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class AttachTaskStatusToUserDto {
  @ApiProperty({ description: 'ID пользователя' })
  @IsNumber()
  readonly userId: number

  @ApiProperty({ description: 'ID статуса' })
  @IsNumber()
  readonly statusId: number
}

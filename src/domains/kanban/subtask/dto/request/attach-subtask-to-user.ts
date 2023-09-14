import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class AttachSubtaskToUser {
  @ApiProperty({ description: 'ID пользователя' })
  @IsNumber()
  readonly userId: number

  @ApiProperty({ description: 'ID подзадачи' })
  @IsNumber()
  readonly subtaskId: number
}

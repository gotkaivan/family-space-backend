import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class AttachNoteGroupToUser {
  @ApiProperty({ description: 'ID пользователя' })
  @IsNumber()
  readonly userId: number

  @ApiProperty({ description: 'ID набора' })
  @IsNumber()
  readonly boardId: number
}

import { ApiProperty } from '@nestjs/swagger'

export class AttachTaskStatusToUserDto {
  @ApiProperty({ description: 'ID пользователя' })
  readonly userId: number

  @ApiProperty({ description: 'ID статуса' })
  readonly statusId: number
}

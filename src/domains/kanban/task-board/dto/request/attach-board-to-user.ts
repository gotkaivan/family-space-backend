import { ApiProperty } from '@nestjs/swagger'

export class AttachBoardToUser {
  @ApiProperty({ description: 'ID пользователя' })
  readonly userId: number

  @ApiProperty({ description: 'ID группы' })
  readonly groupId: number
}

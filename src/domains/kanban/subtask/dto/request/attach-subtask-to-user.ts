import { ApiProperty } from '@nestjs/swagger'

export class AttachSubtaskToUser {
  @ApiProperty({ description: 'ID пользователя' })
  readonly userId: number

  @ApiProperty({ description: 'ID подзадачи' })
  readonly subtaskId: number
}

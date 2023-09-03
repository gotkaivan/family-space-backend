import { ApiProperty } from '@nestjs/swagger'

export class AttachTaskToUser {
  @ApiProperty({ description: 'ID пользователя' })
  readonly userId: number

  @ApiProperty({ description: 'ID задачи' })
  readonly taskId: number
}

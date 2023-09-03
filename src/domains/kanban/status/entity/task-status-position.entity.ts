import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { ITaskStatusPosition } from '../types'

export class TaskStatusPositionEntity implements ITaskStatusPosition {
  @ApiProperty({ example: 'id', description: 'Идентификатор задачи' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: '1', description: 'Позиция задачи относительно других задач' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly value: number

  @ApiProperty({ example: '1', description: 'ID статуса' })
  readonly statusId: number
}

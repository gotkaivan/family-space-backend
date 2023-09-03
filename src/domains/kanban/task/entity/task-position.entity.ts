import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { ITaskPosition } from '../types'

export class TaskPositionEntity implements ITaskPosition {
  @ApiProperty({ example: 'id', description: 'Идентификатор задачи' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: '1', description: 'Позиция задачи относительно других задач' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly value: number

  @ApiProperty({ example: '1', description: 'ID задачи' })
  readonly taskId: number
}

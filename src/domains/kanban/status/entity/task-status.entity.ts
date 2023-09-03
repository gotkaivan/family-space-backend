import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { ITaskStatus } from '../types'
import { TaskEntity } from '../../task/entity/task.entity'
import { TaskDto } from '../../task/dto/task.dto'
import { TaskStatusPositionEntity } from './task-status-position.entity'

export class TaskStatusEntity implements ITaskStatus {
  @ApiProperty({ example: 'id', description: 'Идентификатор статуса' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: 'Колонка', description: 'Название статуса' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string

  @ApiProperty({ example: 'Описание', description: 'Описание статуса' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string

  @ApiProperty({ description: 'Задачи', type: [TaskDto] })
  tasks: TaskEntity[]

  @ApiProperty({ example: 'Позиция статуса' })
  position: TaskStatusPositionEntity
}

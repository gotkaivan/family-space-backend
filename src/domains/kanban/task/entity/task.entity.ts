import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { ITask } from '../types'
import { SubtaskEntity } from '../../subtask/entity/subtask.entity'
import { SubtaskDto } from '../../subtask/dto/subtask.dto'
import { TaskPositionEntity } from './task-position.entity'

export class TaskEntity implements ITask {
  @ApiProperty({ example: 'id', description: 'Идентификатор задачи' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: 'Задача', description: 'Название задачи' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string

  @ApiProperty({ example: 'Описание', description: 'Описание задачи' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string

  @ApiProperty({ example: '1', description: 'ID статуса' })
  @IsNumber()
  readonly statusId: number

  @ApiProperty({ description: 'Подзадачи', type: [SubtaskDto] })
  subtasks: SubtaskEntity[]

  @ApiProperty({ description: '1', example: 'Позиция статуса' })
  position: TaskPositionEntity
}

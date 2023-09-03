import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsBoolean } from 'class-validator'
import { ISubTask } from '../types'

export class SubtaskEntity implements ISubTask {
  @ApiProperty({ example: 'id', description: 'Идентификатор задачи' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: 'Контент подзадачи', description: 'Контент подзадачи' })
  @IsString({ message: 'Должно быть строкой' })
  readonly content: string

  @ApiProperty({ example: '1', description: 'Позиция подзадачи относительно других подзадач' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly position: number

  @ApiProperty({ example: '1', description: 'ID задачи, которой относится подзадача' })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly taskId: number

  @ApiProperty({ example: 'true', description: 'Признак завершенности подзадачи' })
  @IsBoolean({ message: 'Должно быть boolean значением' })
  readonly isCompleted: boolean
}

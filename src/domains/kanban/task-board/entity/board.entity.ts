import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { IBoard } from '../types'

export class BoardEntity implements IBoard {
  @ApiProperty({ example: 'id', description: 'Идентификатор задачи' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: 'Задача', description: 'Название группы' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string

  @ApiProperty({ example: 'Описание', description: 'Описание группы' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string

  @ApiProperty({ description: '1', example: 'Позиция группы' })
  @IsNumber()
  readonly position: number
}

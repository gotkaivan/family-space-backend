import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { INote } from '../types'

export class NoteEntity implements INote {
  @ApiProperty({ example: 'id', description: 'Идентификатор заметки' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: 'Задача', description: 'Название заметки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string

  @ApiProperty({ example: 'Описание', description: 'Описание заметки', required: false })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string

  @ApiProperty({ example: 'Контент', description: 'Контент заметки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly content: string

  @ApiProperty({ example: '1', description: 'ID набора заметок' })
  @IsNumber()
  readonly boardId: number

  @ApiProperty({ description: 'Закрепить заметку', example: false })
  @IsNumber()
  readonly isFavorite: boolean
}

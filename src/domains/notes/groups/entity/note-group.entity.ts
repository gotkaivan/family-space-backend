import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { INoteGroup } from '../types'

export class NoteGroupEntity implements INoteGroup {
  @ApiProperty({ example: 'id', description: 'Идентификатор набора' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: 'Набор', description: 'Название набора' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string

  @ApiProperty({ example: 'Описание', description: 'Описание набора' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string

  @ApiProperty({ description: 'Закрепить набор', example: false })
  @IsNumber()
  readonly isFavorite: boolean
}

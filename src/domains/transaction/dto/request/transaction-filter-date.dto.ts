import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { ITransactionFilterDate } from '../../types'

export class TransactionFiltersDateDto implements ITransactionFilterDate {
  @ApiProperty({ example: '', description: 'Начальная дата' })
  @IsString()
  readonly startDate: string

  @ApiProperty({ example: '', description: 'Конечная дата' })
  @IsString()
  readonly endDate: string
}

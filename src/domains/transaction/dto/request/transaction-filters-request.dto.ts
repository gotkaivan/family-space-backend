import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { CURRENCY_TYPE, ITransactionFilterOptions, TRANSACTION_TYPES } from '../../types'
import { TransactionFiltersDateDto } from './transaction-filter-date.dto'

export class TransactionFiltersRequestDto implements ITransactionFilterOptions {
  @ApiProperty({ example: 'search', description: 'Поисковой запрос', required: false })
  @IsString()
  readonly search: string

  @ApiProperty({ example: 'income', description: 'Тип транзакции', enum: TRANSACTION_TYPES, required: false })
  @IsString({ message: 'Должно быть строкой' })
  readonly transactionType: TRANSACTION_TYPES

  @ApiProperty({ example: 'EUR', description: 'Тип валюты', enum: CURRENCY_TYPE, required: false })
  @IsString({ message: 'Должно быть строкой' })
  readonly currencyType: CURRENCY_TYPE

  @ApiProperty({
    example: '',
    description: 'Дата совершения транзакции',
    type: TransactionFiltersDateDto,
    required: false,
  })
  readonly transactionDate: TransactionFiltersDateDto
}

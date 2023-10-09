import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { ITransaction, TRANSACTION_STATUSES, TRANSACTION_TYPES } from '../types'
import { CURRENCY_TYPE } from 'src/common/types'

export class TransactionEntity implements ITransaction {
  @ApiProperty({ example: 'id', description: 'Идентификатор набора' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: 'Транзакция', description: 'Название транзакции' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string

  @ApiProperty({ example: 'Описание', description: 'Описание транзакции' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string

  @ApiProperty({ example: 'income', description: 'Тип транзакции', enum: TRANSACTION_TYPES })
  @IsString({ message: 'Должно быть строкой' })
  readonly transactionType: TRANSACTION_TYPES

  @ApiProperty({ example: 'EUR', description: 'Тип валюты', enum: CURRENCY_TYPE })
  @IsString({ message: 'Должно быть строкой' })
  readonly currencyType: CURRENCY_TYPE

  @ApiProperty({ example: '0', description: 'Цена покупки одной единицы' })
  @IsNumber()
  readonly purchasePrice: number

  @ApiProperty({ example: '0', description: 'Сколько должен денег', required: false })
  @IsNumber()
  readonly owesPrice?: number

  @ApiProperty({ example: '7000', description: 'Текущая стоимость одной единицы' })
  @IsNumber()
  readonly currentPrice: number

  @ApiProperty({ example: '777', description: 'Количество единиц при покупке' })
  @IsNumber()
  readonly purchaseAmount: number

  @ApiProperty({ example: '777', description: 'Текущее количество единиц' })
  @IsNumber()
  readonly currentAmount: number

  @ApiProperty({ example: '', description: 'Дата совершения транзакции', nullable: true })
  @IsNumber()
  readonly transactionDate: string | null

  @ApiProperty({ example: '1', description: 'ID транзакции для продажи', required: false })
  @IsNumber()
  readonly transactionSaleId?: number

  @ApiProperty({ example: TRANSACTION_STATUSES.ACTIVE, description: 'Статус транзакции', enum: TRANSACTION_STATUSES })
  @IsString({ message: 'Должно быть строкой' })
  readonly status: TRANSACTION_STATUSES
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { CURRENCY_TYPE, ITransaction, TRANSACTION_TYPES } from '../types'

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

  @ApiProperty({ example: 'income', description: 'Тип транзакции' })
  @IsString({ message: 'Должно быть строкой' })
  readonly transactionType: TRANSACTION_TYPES

  @ApiProperty({ example: 'EUR', description: 'Тип валюты' })
  @IsString({ message: 'Должно быть строкой' })
  readonly currencyType: CURRENCY_TYPE

  @ApiProperty({ example: '0', description: 'Цена покупки одной единицы' })
  @IsNumber()
  readonly purchasePrice: number

  @ApiProperty({ example: '0', description: 'Сколько должен денег' })
  @IsNumber()
  readonly owesPrice?: number

  @ApiProperty({ example: '7000', description: 'Текущая стоимость одной единицы' })
  @IsNumber()
  readonly currentPrice: number

  @ApiProperty({ example: '777', description: 'Количество единиц' })
  @IsNumber()
  readonly amount: number

  @ApiProperty({ example: '', description: 'Дата совершения транзакции' })
  @IsNumber()
  readonly transactionDate: string
}

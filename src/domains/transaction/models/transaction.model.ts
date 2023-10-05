import { ApiProperty } from '@nestjs/swagger'
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'
import { CreateTransactionDto } from '../dto/request/create-transaction.dto'
import { CURRENCY_TYPE, TRANSACTION_TYPES } from '../types'
import { UserModel } from 'src/domains/users/user.model'
import { TransactionUserModel } from './transaction-user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'

@Table({ tableName: 'transactions', createdAt: 'created', updatedAt: 'updated' })
export class TransactionModel extends Model<TransactionModel, CreateTransactionDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Транзакция', description: 'Название транзакции' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string

  @ApiProperty({ example: 'Описание задачи', description: 'Описание транзакции' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string

  @ApiProperty({
    example: TRANSACTION_TYPES.INCOME__TRANSACTION__TYPE,
    description: 'Тип транзакции',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  transactionType: TRANSACTION_TYPES

  @ApiProperty({ example: CURRENCY_TYPE.EUR, description: 'Тип валюты' })
  @Column({ type: DataType.STRING, allowNull: false })
  currencyType: CURRENCY_TYPE

  @ApiProperty({ example: '0', description: 'Цена покупки одной единицы' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  purchasePrice: number

  @ApiProperty({ example: '0', description: 'Сколько должен денег', required: false })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  owesPrice: number

  @ApiProperty({ example: '7000', description: 'Текущая стоимость одной единицы' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  currentPrice: number

  @ApiProperty({ example: '777', description: 'Количество единиц' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  amount: number

  @ApiProperty({ example: '', description: 'Дата совершения транзакции', nullable: true })
  @Column({ type: DataType.STRING, allowNull: true })
  transactionDate: string | null

  @BelongsToMany(() => UserModel, () => TransactionUserModel)
  user: UserEntity[]
}

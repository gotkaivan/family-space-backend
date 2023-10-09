import { CURRENCY_TYPE } from 'src/common/types'

export enum TRANSACTION_STATUSES {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum TRANSACTION_TYPES {
  INCOME__TRANSACTION__TYPE = 'income',
  EXPENSES__TRANSACTION__TYPE = 'expenses',
  INVESTMENT__TRANSACTION__TYPE = 'investment',
  SALE__TRANSACTION__TYPE = 'sale',
}

export interface ITransaction {
  id: number
  title: string
  description: string
  transactionType: TRANSACTION_TYPES
  currencyType: CURRENCY_TYPE
  purchasePrice: number
  currentPrice: number
  owesPrice?: number
  purchaseAmount: number
  currentAmount: number
  transactionDate: string
  status: TRANSACTION_STATUSES
}

export interface ITransactionFilterDate {
  startDate: string
  endDate: string
}

export interface ITransactionFilterOptions {
  search?: string
  currencyType?: CURRENCY_TYPE
  transactionType?: TRANSACTION_TYPES
  transactionDate?: ITransactionFilterDate
}

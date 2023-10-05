export enum TRANSACTION_TYPES {
  INCOME__TRANSACTION__TYPE = 'income',
  EXPENSES__TRANSACTION__TYPE = 'expenses',
  INVESTMENT__TRANSACTION__TYPE = 'investment',
  SALE__TRANSACTION__TYPE = 'sale',
}

export enum CURRENCY_TYPE {
  EUR = 'EUR',
  RUB = 'RUB',
  USD = 'USD',
}

export interface ITransaction {
  id: number
  title: string
  description: string
  transactionType: TRANSACTION_TYPES
  currencyType: CURRENCY_TYPE
  purchasePrice: number
  owesPrice?: number
  currentPrice: number
  amount: number
  transactionDate: string
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

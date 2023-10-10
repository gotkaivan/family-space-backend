import { Transaction } from 'sequelize'

export interface IPaginationRequest {
  limit: number
  page: number
}

export enum CURRENCY_TYPE {
  EUR = 'EUR',
  RUB = 'RUB',
  USD = 'USD',
}

export interface ITransactionHost {
  transaction: Transaction
}

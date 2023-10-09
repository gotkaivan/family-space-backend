import { CURRENCY_TYPE } from 'src/common/types'
import { ITransaction } from 'src/domains/transaction/types'

export interface IInvestment extends ITransaction {}

export interface IInvestmentFilterDate {
  startDate: string
  endDate: string
}

export interface IInvestmentFilterOptions {
  search?: string
  currencyType?: CURRENCY_TYPE
  transactionDate?: IInvestmentFilterDate
}

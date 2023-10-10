import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { TransactionService } from '../transaction/transaction.service'
import { getBadRequest } from 'src/common/helpers'
import { GetInvestmentsResponseDto } from './dto/response/get-investments.dto'
import { InvestmentRequestOptionsDto } from './dto/request/investment-request-options.dto'
import { TransactionFiltersRequestDto } from '../transaction/dto/request/transaction-filters-request.dto'
import { TRANSACTION_STATUSES, TRANSACTION_TYPES } from '../transaction/types'
import { CreateInvestmentDto } from './dto/request/create-investment.dto'
import { InvestmentDto } from './dto/investment.dto'
import { UpdateInvestmentDto } from './dto/request/update-investment.dto'
import { SaleInvestmentResponseDto } from './dto/response/sale-investment.dto'
import { Sequelize } from 'sequelize-typescript'
import { ITransactionHost } from 'src/common/types'

@Injectable()
export class InvestmentService {
  constructor(private transactionService: TransactionService, private sequelize: Sequelize) {}

  /**
   * Метод получения инвестиций
   * @param accessToken string
   * @returns Promise<InvestmentDto[]>
   */

  async getInvestments(accessToken: string, options?: InvestmentRequestOptionsDto): Promise<GetInvestmentsResponseDto> {
    try {
      const filters: TransactionFiltersRequestDto = {
        ...options.filters,
        transactionType: TRANSACTION_TYPES.INVESTMENT__TRANSACTION__TYPE,
      }
      return await this.transactionService.getTransactions(accessToken, { ...options, filters })
    } catch (e) {
      throw new HttpException('Инвестиции не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод создания инвестиции
   * @param accessToken string
   * @param investment CreateInvestmentDto
   * @returns Promise<InvestmentDto>
   */

  async createInvestment(accessToken: string, investment: CreateInvestmentDto): Promise<InvestmentDto> {
    try {
      return await this.transactionService.createTransaction(accessToken, investment)
    } catch (e) {
      getBadRequest('Не удалось создать инвестицию')
    }
  }

  /**
   * Метод создания инвестиции
   * @param accessToken string
   * @param investment UpdateInvestmentDto
   * @returns Promise<InvestmentDto>
   */

  async updateInvestment(accessToken: string, investment: UpdateInvestmentDto): Promise<InvestmentDto> {
    try {
      return await this.transactionService.updateTransaction(accessToken, investment.id, investment)
    } catch (e) {
      getBadRequest('Не удалось обновить инвестицию')
    }
  }

  /**
   * Метод продажи инвестиции
   * @param accessToken string
   * @param investment UpdateInvestmentDto
   * @returns Promise<InvestmentDto>
   */

  async saleInvestment(accessToken: string, sale: UpdateInvestmentDto): Promise<SaleInvestmentResponseDto> {
    const { id: saleId, ...saleWithoutId } = sale
    if (!sale.transactionSaleId) {
      getBadRequest('Не удалось найти инвестицию')
      return
    }

    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost: ITransactionHost = { transaction: t }

        const investment = await this.transactionService.getTransactionById(accessToken, saleId)

        const amount = +investment.currentAmount - +sale.currentAmount

        if (amount < 0) getBadRequest('Количество единиц продажи не должно превышать имеющееся количество единиц')

        const createdSaleTransaction = await this.transactionService.createTransaction(
          accessToken,
          saleWithoutId,
          transactionHost
        )

        const investmentForUpdate = {
          ...investment,
          currentAmount: amount,
          status: amount === 0 ? TRANSACTION_STATUSES.INACTIVE : TRANSACTION_STATUSES.ACTIVE,
        }

        const updatedInvestment = await this.transactionService.updateTransaction(
          accessToken,
          investment.id,
          { ...investmentForUpdate },
          transactionHost
        )

        return {
          sale: createdSaleTransaction,
          investment: updatedInvestment,
        }
      })
    } catch (e) {
      getBadRequest('Не удалось продать инвестицию')
    }
  }

  /**
   * Метод удаления инвестиции
   * @param id number
   * @returns Promise<{ id: numebr }>
   */

  async deleteInvestment(accessToken: string, id: number): Promise<{ id: number }> {
    try {
      return await this.transactionService.deleteTransaction(accessToken, id)
    } catch (e) {
      getBadRequest('Не удалось удалить инвестицию')
    }
  }
}

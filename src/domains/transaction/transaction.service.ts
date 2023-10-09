import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/domains/users/users.service'
import { getBadRequest } from 'src/common/helpers'
import { TransactionModel } from './models/transaction.model'
import { TransactionUserModel } from './models/transaction-user.model'
import { TransactionDto } from './dto/transaction.dto'
import { CreateTransactionDto } from './dto/request/create-transaction.dto'
import { UpdateTransactionDto } from './dto/request/update-transaction.dto'
import { AttachTransactionToUser } from './dto/request/attach-transaction-to-user.dto'
import { TransactionFiltersRequestDto } from './dto/request/transaction-filters-request.dto'
import { TransactionRequestOptionsDto } from './dto/request/transaction-request-options.dto'
import { GetTransactionsResponseDto } from './dto/response/get-transactions.dto'
import { UpdateSaleTransactionResponseDto } from './dto/response/update-sale-transaction.dto'
import { TRANSACTION_TYPES } from './types'

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionModel) private transactionRepository: typeof TransactionModel,
    @InjectModel(TransactionUserModel) private transactionUserRepository: typeof TransactionUserModel,
    private userService: UsersService
  ) {}

  /**
   * Метод получения транзакций
   * @param accessToken string
   * @returns Promise<TransactionDto[]>
   */

  async getTransactions(
    accessToken: string,
    options?: TransactionRequestOptionsDto
  ): Promise<GetTransactionsResponseDto> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)

      const filters = this.formatRequestFilters(options.filters)

      const attributes = {
        where: {
          ...filters,
        },
        include: [
          {
            attributes: [],
            where: { id },
            required: true,
            association: 'user',
          },
        ],
      }

      const total = await this.transactionRepository.count(attributes)

      const items = await this.transactionRepository.findAll({
        ...attributes,
        limit: options.pagination.limit,
        offset: (options.pagination.page - 1) * options.pagination.limit,
        order: [['transactionDate', 'DESC']],
      })

      return {
        items,
        total,
      }
    } catch (e) {
      throw new HttpException('Транзакции не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод получения транзакции по ID
   * @param accessToken string
   * @param id number
   * @returns Promise<TransactionDto>
   */

  async getTransactionById(accessToken: string, id: number): Promise<TransactionDto> {
    try {
      const user = await this.userService.getUserByToken(accessToken)
      return await this.transactionRepository.findOne({
        include: [
          {
            attributes: [],
            where: { id: user.id },
            required: true,
            association: 'user',
          },
        ],
        where: { id },
      })
    } catch (e) {
      throw new HttpException('Транзакция не найдена или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод создания транзакции
   * @param accessToken string
   * @param board CreateTransactionDto
   * @returns Promise<TransactionDto>
   */

  async createTransaction(accessToken: string, transaction: CreateTransactionDto): Promise<TransactionDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: transactionId } = await this.transactionRepository.create({ ...transaction })
      await this.attachTransactionToUser({ userId, transactionId })
      return this.getTransactionById(accessToken, transactionId)
    } catch (e) {
      getBadRequest('Не удалось создать транзакцию')
    }
  }

  /**
   * Метод создания транзакции
   * @param accessToken string
   * @param transaction UpdateTransactionDto
   * @returns Promise<TransactionDto>
   */

  async updateTransaction(accessToken: string, id: number, transaction: UpdateTransactionDto): Promise<TransactionDto> {
    try {
      await this.transactionRepository.update({ ...transaction }, { where: { id } })
      return await this.getTransactionById(accessToken, id)
    } catch (e) {
      getBadRequest('Не удалось обновить транзакцию')
    }
  }

  /**
   * Метод удаления транзакции
   * @param id number
   * @returns Promise<{ id: numebr }>
   */

  async deleteTransaction(accessToken: string, id: number): Promise<{ id: number }> {
    try {
      const { id: transactionId, transactionType } = await this.getTransactionById(accessToken, id)
      if (transactionType === TRANSACTION_TYPES.INVESTMENT__TRANSACTION__TYPE) {
        await this.transactionRepository.destroy({
          where: {
            transactionSaleId: transactionId,
          },
        })
      }
      const deletedId = await this.transactionRepository.destroy({
        where: {
          id,
        },
      })

      await this.transactionUserRepository.destroy({
        where: {
          transactionId: id,
        },
      })

      return { id: deletedId }
    } catch (e) {
      getBadRequest('Не удалось удалить набор')
    }
  }

  /**
   * Метод прикрепления транзакции к пользователю
   * @param item AttachTransactionToUser
   * @returns
   */

  private async attachTransactionToUser(item: AttachTransactionToUser) {
    try {
      return this.transactionUserRepository.findOrCreate({
        raw: true,
        where: {
          ...item,
        },
        defaults: item,
      })
    } catch (e) {
      getBadRequest('Не удалось прикрепить транзакцию к пользователю')
    }
  }

  async updateSaleTransaction(
    accessToken: string,
    sale: UpdateTransactionDto
  ): Promise<UpdateSaleTransactionResponseDto> {
    if (!sale.transactionSaleId) {
      getBadRequest('Не удалось найти инвестицию')
      return
    }
    try {
      const investment = await this.getTransactionById(accessToken, sale.transactionSaleId)
      const salePreview = await this.getTransactionById(accessToken, sale.id)

      let updatedInvestmentRequest = {
        ...investment,
      }

      if (+sale.currentAmount > +salePreview.currentAmount) {
        const saleAmount = +sale.currentAmount - +salePreview.currentAmount
        const amount = +investment.currentAmount - +saleAmount

        updatedInvestmentRequest = {
          ...investment,
          currentAmount: amount,
        }
      }

      if (+sale.currentAmount < +salePreview.currentAmount) {
        const saleAmount = +salePreview.currentAmount - +sale.currentAmount
        const amount = +investment.currentAmount + +saleAmount
        updatedInvestmentRequest = {
          ...investment,
          currentAmount: amount,
        }
      }
      const updatedSaleTransaction = await this.updateTransaction(accessToken, sale.id, sale)
      const updatedInvestment = await this.updateTransaction(accessToken, investment.id, updatedInvestmentRequest)
      return {
        sale: updatedSaleTransaction,
        transaction: updatedInvestment,
      }
    } catch (e) {
      getBadRequest('Не удалось обновить транзакцию по продаже')
    }
  }

  /**
   * Метод удаления транзакции продажи
   * @param id number
   * @returns Promise<{ id: numebr }>
   */

  async deleteSaleTransaction(accessToken: string, id: number): Promise<{ id: number }> {
    try {
      const { id: saleId, transactionSaleId } = await this.getTransactionById(accessToken, id)
      if (!transactionSaleId) {
        getBadRequest('Не удалось найти инвестицию')
        return
      }
      const investment = await this.getTransactionById(accessToken, transactionSaleId)
      await this.updateTransaction(accessToken, investment.id, {
        ...investment,
        currentAmount: investment.purchaseAmount,
      })
      await this.deleteTransaction(accessToken, id)
      return {
        id: saleId,
      }
    } catch (e) {
      getBadRequest('Не удалось удалить транзакцию продажи')
    }
  }

  /**
   * Метод прикрепления транзакции к пользователю
   * @param item AttachTransactionToUser
   * @returns
   */

  private formatRequestFilters(options: TransactionFiltersRequestDto | undefined) {
    const response = {}
    if (options.search) {
      //@ts-ignore
      response.title = {
        [Op.iLike]: `%${options.search}%`,
      }
    }

    //@ts-ignore
    if (options.currencyType) response.currencyType = options.currencyType
    //@ts-ignore
    if (options.transactionType) response.transactionType = options.transactionType
    if (options.transactionDate && !!options.transactionDate.startDate && !!options.transactionDate.endDate) {
      //@ts-ignore
      response.transactionDate = {
        [Op.between]: [options.transactionDate.startDate, options.transactionDate.endDate],
      }
    }
    return response
  }
}

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
        order: [['id', 'ASC']],
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

  async createTransaction(accessToken: string, board: CreateTransactionDto): Promise<TransactionDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: transactionId } = await this.transactionRepository.create({ ...board })
      await this.attachTransactionToUser({ userId, transactionId })
      return this.getTransactionById(accessToken, transactionId)
    } catch (e) {
      console.log(e)
      getBadRequest('Не удалось создать транзакцию')
    }
  }

  /**
   * Метод создания транзакции
   * @param accessToken string
   * @param transaction UpdateTransactionDto
   * @returns Promise<TransactionDto>
   */

  async updateTransaction(accessToken: string, transaction: UpdateTransactionDto): Promise<TransactionDto> {
    try {
      await this.transactionRepository.update({ ...transaction }, { where: { id: transaction.id } })
      return await this.getTransactionById(accessToken, transaction.id)
    } catch (e) {
      getBadRequest('Не удалось обновить транзакцию')
    }
  }

  /**
   * Метод удаления транзакции
   * @param id number
   * @returns Promise<{ id: numebr }>
   */

  async deleteTransaction(id: number): Promise<{ id: number }> {
    try {
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

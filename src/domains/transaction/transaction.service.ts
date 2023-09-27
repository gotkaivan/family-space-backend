import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/domains/users/users.service'
import { getBadRequest } from 'src/helpers'
import { TransactionModel } from './models/transaction.model'
import { TransactionUserModel } from './models/transaction-user.model'
import { TransactionDto } from './dto/transaction.dto'
import { CreateTransactionDto } from './dto/request/create-transaction.dto'
import { UpdateTransactionDto } from './dto/request/update-transaction.dto'
import { AttachTransactionToUser } from './dto/request/attach-transaction-to-user'

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

  async getTransactions(accessToken: string): Promise<TransactionDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      return await this.transactionRepository.findAll({
        order: [['id', 'ASC']],
        include: [
          {
            attributes: [],
            where: { id },
            required: true,
            association: 'user',
          },
        ],
      })
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
        where: item,
        defaults: item,
      })
    } catch (e) {
      getBadRequest('Не удалось прикрепить транзакцию к пользователю')
    }
  }
}

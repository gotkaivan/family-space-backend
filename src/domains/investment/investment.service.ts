import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { TransactionModel } from '../transaction/models/transaction.model'
import { UsersService } from '../users/users.service'
import { TransactionDto } from '../transaction/dto/transaction.dto'
import { TRANSACTION_TYPES } from '../transaction/types'

@Injectable()
export class InvestmentService {
  constructor(
    @InjectModel(TransactionModel) private transactionRepository: typeof TransactionModel,
    private userService: UsersService
  ) {}

  /**
   * Метод получения инвестиций
   * @param accessToken string
   * @returns Promise<TransactionDto[]>
   */

  async getInvestments(accessToken: string): Promise<TransactionDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      return await this.transactionRepository.findAll({
        order: [['id', 'ASC']],
        where: {
          transactionType: TRANSACTION_TYPES.INVESTMENT__TRANSACTION__TYPE,
        },
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
      throw new HttpException('Инвестиции не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/domains/users/users.service'
import { BoardModel } from './models/board.model'
import { AttachBoardToUser } from './dto/request/attach-board-to-user'
import { BoardDto } from './dto/task-group.dto'
import { UpdateBoardDto } from './dto/request/update-board.dto'
import { CreateBoardDto } from './dto/request/create-board.dto'
import { BoardUserModel } from './models/board-user.model'
import { getBadRequest } from 'src/common/helpers'

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(BoardModel) private boardRepository: typeof BoardModel,
    @InjectModel(BoardUserModel) private userBoardRepository: typeof BoardUserModel,
    private userService: UsersService
  ) {}

  /**
   * Метод получения канбан досок
   * @param accessToken string
   * @returns Promise<BoardDto[]>
   */

  async getBoards(accessToken: string): Promise<BoardDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      return await this.boardRepository.findAll({
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
      throw new HttpException('Доски не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод получения канбан доски по ID
   * @param accessToken string
   * @param id number
   * @returns Promise<BoardDto>
   */

  async getBoardById(accessToken: string, id: number): Promise<BoardDto> {
    try {
      const user = await this.userService.getUserByToken(accessToken)
      return await this.boardRepository.findOne({
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
      throw new HttpException('Доска не найдена или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод создания канбан доски
   * @param accessToken string
   * @param board CreateBoardDto
   * @returns Promise<BoardDto>
   */

  async createBoard(accessToken: string, board: CreateBoardDto): Promise<BoardDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: groupId } = await this.boardRepository.create({ ...board })
      await this.attachBoardToUser({ userId, groupId })
      return this.getBoardById(accessToken, groupId)
    } catch (e) {
      getBadRequest('Не удалось создать доску')
    }
  }

  /**
   * Метод создания канбан доски
   * @param accessToken string
   * @param board CreateBoardDto
   * @returns Promise<BoardDto>
   */

  async updateBoard(accessToken: string, board: UpdateBoardDto): Promise<BoardDto> {
    try {
      await this.boardRepository.update({ ...board, position: Math.round(board.position) }, { where: { id: board.id } })
      return await this.getBoardById(accessToken, board.id)
    } catch (e) {
      getBadRequest('Не удалось обновить доску')
    }
  }

  /**
   * Метод удаления канбан доски
   * @param id number
   * @returns Promise<{ id: numebr }>
   */

  async deleteBoard(id: number): Promise<{ id: number }> {
    try {
      const deletedId = await this.boardRepository.destroy({
        where: {
          id,
        },
      })

      await this.userBoardRepository.destroy({
        where: {
          groupId: id,
        },
      })

      return { id: deletedId }
    } catch (e) {
      getBadRequest('Не удалось удалить задачу')
    }
  }

  /**
   * Метод прикрепления доски к пользователю
   * @param item AttachBoardToUser
   * @returns
   */

  private async attachBoardToUser(item: AttachBoardToUser) {
    try {
      return this.userBoardRepository.findOrCreate({
        raw: true,
        where: {
          ...item,
        },
        defaults: item,
      })
    } catch (e) {
      getBadRequest('Не удалось прикрепить группу к пользователю')
    }
  }
}

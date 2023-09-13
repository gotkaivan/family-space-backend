import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/domains/users/users.service'
import { BoardModel } from './models/board.model'
import { AttachBoardToUser } from './dto/request/attach-board-to-user'
import { BoardDto } from './dto/task-group.dto'
import { UpdateBoardDto } from './dto/request/update-board.dto'
import { CreateBoardDto } from './dto/request/create-board.dto'
import { BoardUserModel } from './models/board-user.model'

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(BoardModel) private boardRepository: typeof BoardModel,
    @InjectModel(BoardUserModel) private userBoardRepository: typeof BoardUserModel,
    private userService: UsersService
  ) {}

  async getTaskGroups(accessToken: string): Promise<BoardDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      return await this.boardRepository.findAll({
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
      throw new HttpException('Группы не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  async getTaskGroupById(accessToken: string, id: number): Promise<BoardDto> {
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
      throw new HttpException('Группа не найдена или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  async createTaskGroup(accessToken: string, group: CreateBoardDto): Promise<BoardDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: groupId } = await this.boardRepository.create({ ...group })
      await this.attachBoardToUser({ userId, groupId })
      return this.getTaskGroupById(accessToken, groupId)
    } catch (e) {
      throw new HttpException('Не удалось создать задачу', HttpStatus.BAD_REQUEST)
    }
  }

  async updateTask(accessToken: string, group: UpdateBoardDto): Promise<BoardDto> {
    try {
      await this.boardRepository.update({ ...group, position: Math.round(group.position) }, { where: { id: group.id } })
      return await this.getTaskGroupById(accessToken, group.id)
    } catch (e) {
      console.log(e)
      throw new HttpException('Не удалось обновить задачу', HttpStatus.BAD_REQUEST)
    }
  }

  async deleteTaskGroup(id: number): Promise<{ id: number }> {
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
      throw new HttpException('Не удалось удалить задачу', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * Добавление слова в набор
   * @param word CreateGroupDictionaryDto
   * @param request Request
   * @returns
   */
  private async attachBoardToUser(item: AttachBoardToUser) {
    try {
      return this.userBoardRepository.findOrCreate({
        raw: true,
        where: item,
        defaults: item,
      })
    } catch (e) {
      throw new HttpException('Не удалось прикрепить группу к пользователю', HttpStatus.BAD_REQUEST)
    }
  }
}

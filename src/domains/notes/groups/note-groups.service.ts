import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/domains/users/users.service'
import { getBadRequest } from 'src/common/helpers'
import { UpdateNoteBoardDto } from './dto/request/update-note-group.dto'
import { NoteGroupUserModel } from './models/note-group-user.model'
import { NoteGroupModel } from './models/note-group.model'
import { NoteGroupDto } from './dto/note-group.dto'
import { CreateNoteGroupDto } from './dto/request/create-note-group.dto'
import { AttachNoteGroupToUser } from './dto/request/attach-note-group-to-user'

@Injectable()
export class NoteBoardsService {
  constructor(
    @InjectModel(NoteGroupModel) private noteBoardRepository: typeof NoteGroupModel,
    @InjectModel(NoteGroupUserModel) private noteBoardUserRepository: typeof NoteGroupUserModel,
    private userService: UsersService
  ) {}

  /**
   * Метод получения наборов досок
   * @param accessToken string
   * @returns Promise<NoteBoardDto[]>
   */

  async getNoteBoards(accessToken: string): Promise<NoteGroupDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      return await this.noteBoardRepository.findAll({
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
      throw new HttpException('Наборы не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод получения набора заметок по ID
   * @param accessToken string
   * @param id number
   * @returns Promise<NoteBoardDto>
   */

  async getNoteBoardById(accessToken: string, id: number): Promise<NoteGroupDto> {
    try {
      const user = await this.userService.getUserByToken(accessToken)
      return await this.noteBoardRepository.findOne({
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
      throw new HttpException('Набор не найден или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод создания набора заметок
   * @param accessToken string
   * @param board CreateBoardDto
   * @returns Promise<NoteBoardDto>
   */

  async createNoteBoard(accessToken: string, board: CreateNoteGroupDto): Promise<NoteGroupDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: boardId } = await this.noteBoardRepository.create({ ...board })
      await this.attachNoteBoardToUser({ userId, boardId })
      return this.getNoteBoardById(accessToken, boardId)
    } catch (e) {
      getBadRequest('Не удалось создать набор')
    }
  }

  /**
   * Метод создания набора
   * @param accessToken string
   * @param board UpdateNoteBoardDto
   * @returns Promise<NoteBoardDto>
   */

  async updateNoteBoard(accessToken: string, board: UpdateNoteBoardDto): Promise<NoteGroupDto> {
    try {
      await this.noteBoardRepository.update({ ...board }, { where: { id: board.id } })
      return await this.getNoteBoardById(accessToken, board.id)
    } catch (e) {
      getBadRequest('Не удалось обновить набор')
    }
  }

  /**
   * Метод удаления набора
   * @param id number
   * @returns Promise<{ id: numebr }>
   */

  async deleteNoteBoard(id: number): Promise<{ id: number }> {
    try {
      const deletedId = await this.noteBoardRepository.destroy({
        where: {
          id,
        },
      })

      await this.noteBoardUserRepository.destroy({
        where: {
          boardId: id,
        },
      })

      return { id: deletedId }
    } catch (e) {
      getBadRequest('Не удалось удалить набор')
    }
  }

  /**
   * Метод прикрепления набора заметок к пользователю
   * @param item AttachNoteBoardToUser
   * @returns
   */

  private async attachNoteBoardToUser(item: AttachNoteGroupToUser) {
    try {
      return this.noteBoardUserRepository.findOrCreate({
        raw: true,
        where: {
          ...item,
        },
        defaults: item,
      })
    } catch (e) {
      getBadRequest('Не удалось прикрепить набор заметок к пользователю')
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/domains/users/users.service'
import { getBadRequest } from 'src/helpers'
import { NoteModel } from './models/note.model'
import { NoteUserModel } from './models/note-user.model'
import { NoteDto } from './dto/note.dto'
import { CreateNoteDto } from './dto/request/create-note.dto'
import { UpdateNoteDto } from './dto/request/update-note.dto'
import { AttachNoteToUser } from './dto/request/attach-note-to-user'

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(NoteModel) private noteRepository: typeof NoteModel,
    @InjectModel(NoteUserModel) private noteUserRepository: typeof NoteUserModel,
    private userService: UsersService
  ) {}

  /**
   * Метод получения заметок по ID набора
   * @param accessToken string
   * @param  boardId number
   * @returns Promise<NoteDto[]>
   */

  async getNotes(accessToken: string, boardId: number): Promise<NoteDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      return await this.noteRepository.findAll({
        include: [
          {
            attributes: [],
            where: { id },
            required: true,
            association: 'user',
          },
          {
            attributes: [],
            where: { id: boardId },
            required: true,
            association: 'noteBoards',
          },
        ],
      })
    } catch (e) {
      throw new HttpException('Заметки не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод получения заметки по ID
   * @param accessToken string
   * @param  id number
   * @returns Promise<NoteDto>
   */

  async getNoteById(accessToken: string, id: number): Promise<NoteDto> {
    try {
      const user = await this.userService.getUserByToken(accessToken)
      return await this.noteRepository.findOne({
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
      throw new HttpException('Заметка не найдена или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод создания заметки
   * @param accessToken string
   * @param  task CreateNoteDto
   * @returns Promise<NoteDto>
   */

  async createNote(accessToken: string, note: CreateNoteDto): Promise<NoteDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: noteId } = await this.noteRepository.create({ ...note })
      await this.attachNoteToUser({ userId, noteId })
      return this.getNoteById(accessToken, noteId)
    } catch (e) {
      getBadRequest('Не удалось создать заметку')
    }
  }

  /**
   * Метод обновления заметки
   * @param accessToken string
   * @param  task UpdateNoteDto
   * @returns Promise<NoteDto>
   */

  async updateNote(accessToken: string, note: UpdateNoteDto): Promise<NoteDto> {
    try {
      await this.noteRepository.update({ ...note }, { where: { id: note.id } })
      return await this.getNoteById(accessToken, note.id)
    } catch (e) {
      getBadRequest('Не удалось обновить заметку')
    }
  }

  /**
   * Метод удаления заметки
   * @param  id number
   * @returns Promise<{ id: number }>
   */

  async deleteNote(id: number): Promise<{ id: number }> {
    try {
      const deletedId = await this.noteRepository.destroy({
        where: {
          id,
        },
      })

      await this.noteUserRepository.destroy({
        where: {
          noteId: id,
        },
      })

      return { id: deletedId }
    } catch (e) {
      getBadRequest('Не удалось удалить заметку')
    }
  }

  /**
   * Метод закрепления заметки к пользователю
   * @param  item AttachNoteToUser
   * @returns
   */

  private async attachNoteToUser(item: AttachNoteToUser) {
    try {
      return this.noteUserRepository.findOrCreate({
        raw: true,
        where: item,
        defaults: item,
      })
    } catch (e) {
      getBadRequest('Не удалось прикрепить заметку к пользователю')
    }
  }
}

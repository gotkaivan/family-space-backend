import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { SubtaskModel } from './models/subtask.model'
import { UsersService } from 'src/domains/users/users.service'
import { SubtaskEntity } from './entity/subtask.entity'
import { CreateSubtaskDto } from './dto/request/create-subtask.dto'
import { UpdateSubtaskDto } from './dto/request/update-subtask.dto'
import { AttachSubtaskToUser } from './dto/request/attach-subtask-to-user'
import { SubtaskUserModel } from './models/subtask-user.model'
import { SubtaskDto } from './dto/subtask.dto'

@Injectable()
export class SubtaskService {
  constructor(
    @InjectModel(SubtaskModel) private subtaskRepository: typeof SubtaskModel,
    @InjectModel(SubtaskUserModel) private subtaskUserRepository: typeof SubtaskUserModel,
    private userService: UsersService
  ) {}

  async getSubtasks(accessToken: string, taskId: number): Promise<SubtaskDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      return await this.subtaskRepository.findAll({
        raw: true,
        include: [
          {
            attributes: [],
            where: { id },
            required: true,
            association: 'user',
          },
          {
            attributes: [],
            where: { id: taskId },
            required: true,
            association: 'task',
          },
        ],
      })
    } catch (e) {
      throw new HttpException('Подзадачи не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  async getSubtaskById(accessToken: string, id: number): Promise<SubtaskDto> {
    try {
      const user = await this.userService.getUserByToken(accessToken)
      return await this.subtaskRepository.findOne({
        raw: true,
        include: {
          attributes: [],
          where: { id: user.id },
          required: true,
          association: 'user',
        },
        where: { id },
      })
    } catch (e) {
      console.log(e)
      throw new HttpException('Подзадача не найдена или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  async createSubtask(accessToken: string, subtask: CreateSubtaskDto): Promise<SubtaskDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: subtaskId } = await this.subtaskRepository.create({ ...subtask })
      await this.attachTaskToUser({ userId, subtaskId })
      return this.getSubtaskById(accessToken, subtaskId)
    } catch (e) {
      throw new HttpException('Не удалось создать задачу', HttpStatus.BAD_REQUEST)
    }
  }

  async updateSubtask(accessToken: string, subtask: UpdateSubtaskDto): Promise<SubtaskDto> {
    const hasSubtask = await this.getSubtaskById(accessToken, subtask.id)
    try {
      if (!hasSubtask) {
        const { id, ...other } = subtask
        await this.createSubtask(accessToken, other)
      } else {
        await this.subtaskRepository.update({ ...subtask }, { where: { id: subtask.id } })
      }
      return this.getSubtaskById(accessToken, subtask.id)
    } catch (e) {
      throw new HttpException('Не удалось обновить подзадачу', HttpStatus.BAD_REQUEST)
    }
  }

  async deleteSubtask(id: number): Promise<{ id: number }> {
    try {
      await this.subtaskRepository.destroy({
        where: {
          id,
        },
      })

      return { id }
    } catch (e) {
      throw new HttpException('Подзадача не найдена', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * Добавление слова в набор
   * @param word CreateGroupDictionaryDto
   * @param request Request
   * @returns
   */
  private async attachTaskToUser(item: AttachSubtaskToUser) {
    try {
      return this.subtaskUserRepository.findOrCreate({
        where: item,
        defaults: item,
      })
    } catch (e) {
      throw new HttpException('Не удалось прикрепить задачу к пользователю', HttpStatus.BAD_REQUEST)
    }
  }
}

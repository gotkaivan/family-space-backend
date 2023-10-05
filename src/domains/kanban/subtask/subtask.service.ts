import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { SubtaskModel } from './models/subtask.model'
import { UsersService } from 'src/domains/users/users.service'
import { CreateSubtaskDto } from './dto/request/create-subtask.dto'
import { UpdateSubtaskDto } from './dto/request/update-subtask.dto'
import { AttachSubtaskToUser } from './dto/request/attach-subtask-to-user'
import { SubtaskUserModel } from './models/subtask-user.model'
import { SubtaskDto } from './dto/subtask.dto'
import { getBadRequest } from 'src/common/helpers'

@Injectable()
export class SubtaskService {
  constructor(
    @InjectModel(SubtaskModel) private subtaskRepository: typeof SubtaskModel,
    @InjectModel(SubtaskUserModel) private subtaskUserRepository: typeof SubtaskUserModel,
    private userService: UsersService
  ) {}

  /**
   * Метод получения подзадач по ID задачи
   * @param accessToken string
   * @param  taskId number
   * @returns Promise<SubtaskDto[]>
   */

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

  /**
   * Метод получения подзадачи по ID
   * @param accessToken string
   * @param  id number
   * @returns Promise<SubtaskDto>
   */

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
      throw new HttpException('Подзадача не найдена или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод создания подзадачи
   * @param accessToken string
   * @param  subtask CreateSubtaskDto
   * @returns Promise<SubtaskDto>
   */

  async createSubtask(accessToken: string, subtask: CreateSubtaskDto): Promise<SubtaskDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: subtaskId } = await this.subtaskRepository.create({ ...subtask })
      await this.attachTaskToUser({ userId, subtaskId })
      return this.getSubtaskById(accessToken, subtaskId)
    } catch (e) {
      getBadRequest('Не удалось создать задачу')
    }
  }

  /**
   * Метод обновления подзадачи
   * @param accessToken string
   * @param  subtask UpdateSubtaskDto
   * @returns Promise<SubtaskDto>
   */

  async updateSubtask(accessToken: string, subtask: UpdateSubtaskDto): Promise<SubtaskDto> {
    const hasSubtask = await this.getSubtaskById(accessToken, subtask.id)
    try {
      if (!subtask.id || !hasSubtask) {
        const { id, ...subtaskWithoutId } = subtask
        await this.createSubtask(accessToken, subtaskWithoutId)
      } else {
        await this.subtaskRepository.update({ ...subtask }, { where: { id: subtask.id } })
      }
      return this.getSubtaskById(accessToken, subtask.id)
    } catch (e) {
      getBadRequest('Не удалось обновить подзадачу')
    }
  }

  /**
   * Метод удаления подзадачи
   * @param id number
   * @returns Promise<{ id: number }>
   */

  async deleteSubtask(id: number): Promise<{ id: number }> {
    try {
      await this.subtaskRepository.destroy({
        where: {
          id,
        },
      })

      return { id }
    } catch (e) {
      getBadRequest('Подзадача не найдена')
    }
  }

  /**
   * Метод прикрепления подзадачи к пользователю
   * @param item AttachSubtaskToUser
   * @returns
   */
  private async attachTaskToUser(item: AttachSubtaskToUser) {
    try {
      return this.subtaskUserRepository.findOrCreate({
        where: {
          ...item,
        },
        defaults: item,
      })
    } catch (e) {
      getBadRequest('Не удалось прикрепить задачу к пользователю')
    }
  }
}

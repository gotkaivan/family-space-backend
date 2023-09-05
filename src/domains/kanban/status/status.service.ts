import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/domains/users/users.service'
import { TaskStatusDto } from './dto/task-status.dto'
import { UserTaskStatusModel } from './models/user-task-status.model'
import { TaskStatusModel } from './models/task-status.model'
import { CreateTaskStatusDto } from './dto/request/create-task-status.dto'
import { UpdateTaskStatusDto } from './dto/request/update-task-status.dto'
import { AttachTaskStatusToUserDto } from './dto/request/attach-task-status-to-user.dto'

@Injectable()
export class TaskStatusService {
  constructor(
    @InjectModel(TaskStatusModel) private taskStatusRepository: typeof TaskStatusModel,
    @InjectModel(UserTaskStatusModel) private userTaskStatusRepository: typeof UserTaskStatusModel,
    private userService: UsersService
  ) {}

  async getTaskStatuses(accessToken: string): Promise<TaskStatusDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      const response = await this.taskStatusRepository.findAll({
        attributes: ['id', 'title', 'description', 'position'],
        order: [
          ['position', 'DESC'],
          ['tasks', 'position', 'DESC'],
        ],
        include: [
          {
            association: 'tasks',
            attributes: ['id', 'title', 'description', 'statusId', 'position'],
            include: [
              {
                attributes: ['id', 'content', 'isCompleted', 'position', 'taskId'],
                association: 'subtasks',
              },
            ],
          },
          {
            attributes: ['id'],
            association: 'user',
            where: {
              id,
            },
          },
        ],
      })
      return response
    } catch (e) {
      throw new HttpException('Статусы не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  async getTaskStatusById(accessToken: string, id: number): Promise<TaskStatusDto> {
    try {
      const user = await this.userService.getUserByToken(accessToken)
      const status = await this.taskStatusRepository.findOne({
        where: { id },
        include: {
          attributes: ['id'],
          where: { id: user.id },
          required: true,
          association: 'user',
        },
      })
      if (status) return status
      throw new Error()
    } catch (e) {
      throw new HttpException('Статус не найден или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  async createTaskStatus(accessToken, status: CreateTaskStatusDto): Promise<TaskStatusDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: statusId } = await this.taskStatusRepository.create(status)
      await this.attachTaskStatusToUser({ userId, statusId })

      return this.getTaskStatusById(accessToken, statusId)
    } catch (e) {
      console.log(e)
      throw new HttpException('Не удалось создать статус', HttpStatus.BAD_REQUEST)
    }
  }

  async updateTaskStatus(accessToken: string, status: UpdateTaskStatusDto): Promise<TaskStatusDto> {
    try {
      await this.taskStatusRepository.update(
        { ...status, position: Math.round(status.position) },
        { where: { id: status.id } }
      )
      return this.getTaskStatusById(accessToken, status.id)
    } catch (e) {
      throw new HttpException('Не удалось обновить статус', HttpStatus.BAD_REQUEST)
    }
  }

  async deleteTaskStatus(id: number): Promise<{ id: number }> {
    try {
      const deletedId = await this.taskStatusRepository.destroy({
        where: {
          id,
        },
      })

      await this.userTaskStatusRepository.destroy({
        where: {
          statusId: id,
        },
      })

      return { id: deletedId }
    } catch (e) {
      throw new HttpException('Не удалось удалить статус', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * Добавление слова в набор
   * @param word CreateGroupDictionaryDto
   * @param request Request
   * @returns
   */
  private async attachTaskStatusToUser(item: AttachTaskStatusToUserDto) {
    try {
      return this.userTaskStatusRepository.findOrCreate({
        raw: true,
        where: item,
        defaults: item,
      })
    } catch (e) {
      throw new HttpException('Не удалось прикрепить статус к пользователю', HttpStatus.BAD_REQUEST)
    }
  }
}

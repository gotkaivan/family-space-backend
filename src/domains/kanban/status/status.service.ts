import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/domains/users/users.service'
import { TaskStatusDto } from './dto/task-status.dto'
import { UserTaskStatusModel } from './models/user-task-status.model'
import { TaskStatusModel } from './models/task-status.model'
import { CreateTaskStatusDto } from './dto/request/create-task-status.dto'
import { UpdateTaskStatusDto } from './dto/request/update-task-status.dto'
import { AttachTaskStatusToUserDto } from './dto/request/attach-task-status-to-user.dto'
import { getBadRequest } from 'src/common/helpers'

@Injectable()
export class TaskStatusService {
  constructor(
    @InjectModel(TaskStatusModel) private taskStatusRepository: typeof TaskStatusModel,
    @InjectModel(UserTaskStatusModel) private userTaskStatusRepository: typeof UserTaskStatusModel,
    private userService: UsersService
  ) {}

  /**
   * Метод получения статусов по ID доски
   * @param accessToken string
   * @param boardId number
   * @returns Promise<TaskStatusDto[]>
   */

  async getTaskStatuses(accessToken: string, boardId: number): Promise<TaskStatusDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      const response = await this.taskStatusRepository.findAll({
        attributes: ['id', 'title', 'description', 'position'],
        order: [
          ['position', 'DESC'],
          ['tasks', 'position', 'DESC'],
          ['tasks', 'subtasks', 'id', 'ASC'],
        ],
        include: [
          {
            association: 'tasks',
            attributes: ['id', 'title', 'description', 'statusId', 'position', 'linkBoardId'],
            include: [
              {
                attributes: ['id', 'title', 'description', 'isCompleted', 'position', 'taskId'],
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
          {
            attributes: ['id'],
            association: 'board',
            where: {
              id: boardId,
            },
          },
        ],
      })
      return response
    } catch (e) {
      throw new HttpException('Статусы не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  /**
   * Метод получения статуса по ID статуса
   * @param accessToken string
   * @param id number
   * @returns Promise<TaskStatusDto>
   */

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
      throw new HttpException('Статус не найден или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    } catch (e) {
      getBadRequest('Статус не найден')
    }
  }

  /**
   * Метод создания статуса
   * @param accessToken string
   * @param status CreateTaskStatusDto
   * @returns Promise<TaskStatusDto>
   */

  async createTaskStatus(accessToken, status: CreateTaskStatusDto): Promise<TaskStatusDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)

      const { id: statusId } = await this.taskStatusRepository.create(status)

      await this.attachTaskStatusToUser({ userId, statusId })

      return this.getTaskStatusById(accessToken, statusId)
    } catch (e) {
      getBadRequest('Не удалось создать статус')
    }
  }

  /**
   * Метод обновления статуса
   * @param accessToken string
   * @param status UpdateTaskStatusDto
   * @returns Promise<TaskStatusDto>
   */

  async updateTaskStatus(accessToken: string, status: UpdateTaskStatusDto): Promise<TaskStatusDto> {
    try {
      await this.taskStatusRepository.update(
        { ...status, position: Math.round(status.position) },
        { where: { id: status.id } }
      )
      return this.getTaskStatusById(accessToken, status.id)
    } catch (e) {
      getBadRequest('Не удалось обновить статус')
    }
  }

  /**
   * Метод удаления статуса
   * @param id number
   * @returns Promise<{ id: number }>
   */

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
      getBadRequest('Не удалось удалить статус')
    }
  }

  /**
   * Добавление слова в набор
   * @param item AttachTaskStatusToUserDto
   * @returns
   */

  private async attachTaskStatusToUser(item: AttachTaskStatusToUserDto) {
    try {
      return this.userTaskStatusRepository.findOrCreate({
        raw: true,
        where: {
          ...item,
        },
        defaults: item,
      })
    } catch (e) {
      getBadRequest('Не удалось прикрепить статус к пользователю')
    }
  }
}

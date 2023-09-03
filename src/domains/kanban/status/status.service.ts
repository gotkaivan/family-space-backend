import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/domains/users/users.service'
import { TaskStatusDto } from './dto/task-status.dto'
import { UserTaskStatusModel } from './models/user-task-status.model'
import { TaskStatusModel } from './models/task-status.model'
import { CreateTaskStatusDto } from './dto/request/create-task-status.dto'
import { UpdateTaskStatusDto } from './dto/request/update-task-status.dto'
import { AttachTaskStatusToUserDto } from './dto/request/attach-task-status-to-user.dto'
import { CreateTaskStatusPositionDto } from './dto/request/create-task-status-position.dto'
import { TaskStatusPositionModel } from './models/task-status-position.model'
import { UpdateTaskStatusPositionDto } from './dto/request/update-task-status-position.dto'

@Injectable()
export class TaskStatusService {
  constructor(
    @InjectModel(TaskStatusModel) private taskStatusRepository: typeof TaskStatusModel,
    @InjectModel(TaskStatusPositionModel) private taskStatusPositionRepository: typeof TaskStatusPositionModel,
    @InjectModel(UserTaskStatusModel) private userTaskStatusRepository: typeof UserTaskStatusModel,
    private userService: UsersService
  ) {}

  async getTaskStatuses(accessToken: string): Promise<TaskStatusDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      const response = await this.taskStatusRepository.findAll({
        attributes: ['id', 'title', 'description'],
        include: [
          {
            association: 'tasks',
            attributes: ['id', 'title', 'description', 'statusId'],
            include: [
              {
                attributes: ['id', 'content', 'isCompleted', 'position', 'taskId'],
                association: 'subtasks',
              },
              {
                association: 'position',
                order: [['position', 'ASC']],
              },
            ],
          },
          {
            association: 'position',
            order: [['position', 'DESC']],
          },
          {
            attributes: [],
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
          attributes: [],
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
      throw new HttpException('Не удалось создать статус', HttpStatus.BAD_REQUEST)
    }
  }

  async updateTaskStatus(accessToken: string, status: UpdateTaskStatusDto): Promise<TaskStatusDto> {
    try {
      await this.taskStatusRepository.update(status, { where: { id: status.id } })
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

  async setStatusPosition(status: CreateTaskStatusPositionDto): Promise<boolean> {
    try {
      await this.taskStatusPositionRepository.findOrCreate({
        raw: true,
        where: status,
        defaults: status,
      })

      return true
    } catch (e) {
      console.log(e)
      throw new HttpException('Не удалось задать позицию статуса', HttpStatus.BAD_REQUEST)
    }
  }

  async changeStatusPosition(status: UpdateTaskStatusPositionDto): Promise<boolean> {
    try {
      await this.taskStatusPositionRepository.update(status, { where: { id: status.id } })
      return true
    } catch (e) {
      throw new HttpException('Не удалось обновить позицию статуса', HttpStatus.BAD_REQUEST)
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

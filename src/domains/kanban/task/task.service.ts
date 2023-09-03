import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { TaskModel } from './models/task.model'
import { UsersService } from 'src/domains/users/users.service'
import { CreateTaskDto } from './dto/request/create-task.dto'
import { UpdateTaskDto } from './dto/request/update-task.dto'
import { TaskUserModel } from './models/task-user.model'
import { AttachTaskToUser } from './dto/request/attach-task-to-user'
import { TaskPositionModel } from './models/task-position.model'
import { CreateTaskPositionDto } from './dto/request/create-task-position.dto'
import { UpdateTaskPositionDto } from './dto/request/update-task-position.dto'
import { TaskDto } from './dto/task.dto'

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TaskModel) private taskRepository: typeof TaskModel,
    @InjectModel(TaskUserModel) private userTaskRepository: typeof TaskUserModel,
    @InjectModel(TaskPositionModel) private taskPositionRepository: typeof TaskPositionModel,
    private userService: UsersService
  ) {}

  async getTasks(accessToken: string, statusId: number): Promise<TaskDto[]> {
    try {
      const { id } = await this.userService.getUserByToken(accessToken)
      return await this.taskRepository.findAll({
        include: [
          {
            attributes: [],
            where: { id },
            required: true,
            association: 'user',
          },
          {
            attributes: [],
            where: { id: statusId },
            required: true,
            association: 'status',
          },
        ],
      })
    } catch (e) {
      throw new HttpException('Задачи не найдены или пренадлежат другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  async getTaskById(accessToken: string, id: number): Promise<TaskDto> {
    try {
      const user = await this.userService.getUserByToken(accessToken)
      return await this.taskRepository.findOne({
        include: [
          {
            attributes: [],
            where: { id: user.id },
            required: true,
            association: 'user',
          },
          {
            association: 'subtasks',
          },
        ],
        where: { id },
      })
    } catch (e) {
      throw new HttpException('Задача не найдена или пренадлежит другому пользователю', HttpStatus.NOT_FOUND)
    }
  }

  async createTask(accessToken: string, task: CreateTaskDto): Promise<TaskDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: taskId } = await this.taskRepository.create({ ...task })
      await this.attachTaskToUser({ userId, taskId })
      return this.getTaskById(accessToken, taskId)
    } catch (e) {
      throw new HttpException('Не удалось создать задачу', HttpStatus.BAD_REQUEST)
    }
  }

  async updateTask(accessToken: string, task: UpdateTaskDto): Promise<TaskDto> {
    try {
      await this.taskRepository.update({ ...task }, { where: { id: task.id } })
      return await this.getTaskById(accessToken, task.id)
    } catch (e) {
      throw new HttpException('Не удалось обновить задачу', HttpStatus.BAD_REQUEST)
    }
  }

  async deleteTask(id: number): Promise<{ id: number }> {
    try {
      const deletedId = await this.taskRepository.destroy({
        where: {
          id,
        },
      })

      await this.userTaskRepository.destroy({
        where: {
          taskId: id,
        },
      })

      return { id: deletedId }
    } catch (e) {
      throw new HttpException('Не удалось удалить задачу', HttpStatus.BAD_REQUEST)
    }
  }

  async setTaskPosition(item: CreateTaskPositionDto): Promise<boolean> {
    await this.taskPositionRepository.findOrCreate({
      raw: true,
      where: item,
      defaults: item,
    })
    return true
  }

  async changeTaskPosition(dto: UpdateTaskPositionDto): Promise<boolean> {
    try {
      await this.taskPositionRepository.update(dto, { where: { id: dto.id } })
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
  private async attachTaskToUser(item: AttachTaskToUser) {
    try {
      return this.userTaskRepository.findOrCreate({
        raw: true,
        where: item,
        defaults: item,
      })
    } catch (e) {
      throw new HttpException('Не удалось прикрепить задачу к пользователю', HttpStatus.BAD_REQUEST)
    }
  }
}

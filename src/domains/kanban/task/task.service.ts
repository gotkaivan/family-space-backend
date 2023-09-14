import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { TaskModel } from './models/task.model'
import { UsersService } from 'src/domains/users/users.service'
import { CreateTaskDto } from './dto/request/create-task.dto'
import { UpdateTaskDto } from './dto/request/update-task.dto'
import { TaskUserModel } from './models/task-user.model'
import { AttachTaskToUser } from './dto/request/attach-task-to-user'
import { TaskDto } from './dto/task.dto'
import { getBadRequest } from 'src/helpers'

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TaskModel) private taskRepository: typeof TaskModel,
    @InjectModel(TaskUserModel) private userTaskRepository: typeof TaskUserModel,
    private userService: UsersService
  ) {}

  /**
   * Метод получения задач по ID статуса
   * @param accessToken string
   * @param  statusId number
   * @returns Promise<TaskDto[]>
   */

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

  /**
   * Метод получения задачи по ID
   * @param accessToken string
   * @param  id number
   * @returns Promise<TaskDto>
   */

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

  /**
   * Метод создания задачи
   * @param accessToken string
   * @param  task CreateTaskDto
   * @returns Promise<TaskDto>
   */

  async createTask(accessToken: string, task: CreateTaskDto): Promise<TaskDto> {
    try {
      const { id: userId } = await this.userService.getUserByToken(accessToken)
      const { id: taskId } = await this.taskRepository.create({ ...task })
      await this.attachTaskToUser({ userId, taskId })
      return this.getTaskById(accessToken, taskId)
    } catch (e) {
      getBadRequest('Не удалось создать задачу')
    }
  }

  /**
   * Метод обновления задачи
   * @param accessToken string
   * @param  task UpdateTaskDto
   * @returns Promise<TaskDto>
   */

  async updateTask(accessToken: string, task: UpdateTaskDto): Promise<TaskDto> {
    try {
      await this.taskRepository.update({ ...task, position: Math.round(task.position) }, { where: { id: task.id } })
      return await this.getTaskById(accessToken, task.id)
    } catch (e) {
      getBadRequest('Не удалось обновить задачу')
    }
  }

  /**
   * Метод удаления задачи
   * @param  id number
   * @returns Promise<{ id: number }>
   */

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
      getBadRequest('Не удалось удалить задачу')
    }
  }

  /**
   * Метод закрепления задачи к пользователю
   * @param  item AttachTaskToUser
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
      getBadRequest('Не удалось прикрепить задачу к пользователю')
    }
  }
}

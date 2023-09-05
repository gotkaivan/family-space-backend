import { Module } from '@nestjs/common'
import { TaskService } from './task/task.service'
import { TaskController } from './task/task.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { TaskModel } from './task/models/task.model'
import { UserModel } from '../users/user.model'
import { UsersService } from '../users/users.service'
import { SubtaskService } from './subtask/subtask.service'
import { SubtaskModel } from './subtask/models/subtask.model'
import { SubtaskController } from './subtask/subtask.controller'
import { StatusController } from './status/status.controller'
import { TaskUserModel } from './task/models/task-user.model'
import { SubtaskUserModel } from './subtask/models/subtask-user.model'
import { TaskStatusModel } from './status/models/task-status.model'
import { UserTaskStatusModel } from './status/models/user-task-status.model'
import { TaskStatusService } from './status/status.service'

@Module({
  controllers: [TaskController, SubtaskController, StatusController],
  imports: [
    SequelizeModule.forFeature([
      TaskStatusModel,
      TaskModel,
      TaskUserModel,
      SubtaskModel,
      SubtaskUserModel,
      UserTaskStatusModel,
      UserModel,
    ]),
  ],
  providers: [TaskService, TaskStatusService, SubtaskService, UsersService],
})
export class TaskModule {}

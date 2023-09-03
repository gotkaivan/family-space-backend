import { ApiProperty } from '@nestjs/swagger'
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript'
import { ITask } from '../types'
import { UserModel } from 'src/domains/users/user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'
import { TaskUserModel } from './task-user.model'
import { TaskPositionModel } from './task-position.model'
import { TaskPositionEntity } from '../entity/task-position.entity'
import { TaskStatusModel } from '../../status/models/task-status.model'
import { CreateTaskDto } from '../dto/request/create-task.dto'
import { SubtaskEntity } from '../../subtask/entity/subtask.entity'
import { SubtaskModel } from '../../subtask/models/subtask.model'
import { TaskStatusEntity } from '../../status/entity/task-status.entity'

@Table({ tableName: 'tasks' })
export class TaskModel extends Model<TaskModel, CreateTaskDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Задача', description: 'Название задачи' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string

  @ApiProperty({ example: 'Описание задачи', description: 'Описание задачи' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string

  @ForeignKey(() => TaskStatusModel)
  @ApiProperty({ example: '1', description: 'ID колонки' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  statusId: number

  @BelongsToMany(() => UserModel, () => TaskUserModel)
  user: UserEntity[]

  @BelongsTo(() => TaskStatusModel)
  status: TaskStatusEntity

  @HasOne(() => TaskPositionModel)
  position: TaskPositionEntity

  @HasMany(() => SubtaskModel)
  subtasks: SubtaskEntity[]
}

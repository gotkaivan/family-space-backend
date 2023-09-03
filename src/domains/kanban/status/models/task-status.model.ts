import { ApiProperty } from '@nestjs/swagger'
import { BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'
import { UserTaskStatusModel } from './user-task-status.model'
import { TaskStatusPositionModel } from './task-status-position.model'
import { TaskStatusPositionEntity } from '../entity/task-status-position.entity'
import { CreateTaskStatusDto } from '../dto/request/create-task-status.dto'
import { TaskEntity } from '../../task/entity/task.entity'
import { TaskModel } from '../../task/models/task.model'

@Table({ tableName: 'task-statuses' })
export class TaskStatusModel extends Model<TaskStatusModel, CreateTaskStatusDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Статус', description: 'Название статуса' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string

  @ApiProperty({ example: 'Описание статуса', description: 'Описание статуса' })
  @Column({ type: DataType.STRING, allowNull: true })
  description: string

  @BelongsToMany(() => UserModel, () => UserTaskStatusModel)
  user: UserEntity[]

  @HasOne(() => TaskStatusPositionModel)
  position: TaskStatusPositionEntity

  @HasMany(() => TaskModel)
  tasks: TaskEntity[]
}

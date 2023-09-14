import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'
import { UserTaskStatusModel } from './user-task-status.model'
import { CreateTaskStatusDto } from '../dto/request/create-task-status.dto'
import { TaskEntity } from '../../task/entity/task.entity'
import { TaskModel } from '../../task/models/task.model'
import { BoardModel } from '../../task-board/models/board.model'
import { BoardEntity } from '../../task-board/entity/board.entity'

@Table({ tableName: 'task-statuses', createdAt: 'created', updatedAt: 'updated' })
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

  @ApiProperty({ example: '1000000', description: 'Позици задачи' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number

  @BelongsToMany(() => UserModel, () => UserTaskStatusModel)
  user: UserEntity[]

  @ForeignKey(() => BoardModel)
  @ApiProperty({ example: '1', description: 'ID статуса' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  boardId: number

  @BelongsTo(() => BoardModel)
  board: BoardEntity

  @HasMany(() => TaskModel)
  tasks: TaskEntity[]
}

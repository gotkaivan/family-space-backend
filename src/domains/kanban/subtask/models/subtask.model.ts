import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ISubTask } from '../types'
import { UserModel } from 'src/domains/users/user.model'
import { TaskModel } from '../../task/models/task.model'
import { SubtaskUserModel } from './subtask-user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'
import { TaskEntity } from '../../task/entity/task.entity'
import { CreateSubtaskDto } from '../dto/request/create-subtask.dto'

@Table({ tableName: 'subtasks' })
export class SubtaskModel extends Model<SubtaskModel, CreateSubtaskDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Контент', description: 'Контент подзадачи' })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  content: string

  @ApiProperty({ example: 'false', description: 'Признак завершенности подзадачи' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isCompleted: boolean

  @ApiProperty({ example: '1', description: 'Позиция подзадачи относительно других подзадач' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  position: number

  @ForeignKey(() => TaskModel)
  @ApiProperty({ example: '1' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  taskId: number

  @BelongsToMany(() => UserModel, () => SubtaskUserModel)
  user: UserEntity[]

  @BelongsTo(() => TaskModel)
  task: TaskEntity[]
}
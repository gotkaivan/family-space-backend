import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { TaskModel } from '../../task/models/task.model'
import { SubtaskUserModel } from './subtask-user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'
import { TaskEntity } from '../../task/entity/task.entity'
import { CreateSubtaskDto } from '../dto/request/create-subtask.dto'

@Table({ tableName: 'subtasks', createdAt: 'created', updatedAt: 'updated' })
export class SubtaskModel extends Model<SubtaskModel, CreateSubtaskDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Название подзадачи', description: 'Название подзадачи' })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  title: string

  @ApiProperty({ example: 'Описание', description: 'Описание подзадачи' })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
  description: string

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

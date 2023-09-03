import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { CreateTaskStatusPositionDto } from '../dto/request/create-task-status-position.dto'
import { TaskStatusModel } from './task-status.model'
import { TaskStatusEntity } from '../entity/task-status.entity'

@Table({ tableName: 'task-status-positions' })
export class TaskStatusPositionModel extends Model<TaskStatusPositionModel, CreateTaskStatusPositionDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: '1000000', description: 'Позици задачи' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  value: number

  @ForeignKey(() => TaskStatusModel)
  @ApiProperty({ example: '1', description: 'ID задачи' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  statusId: number

  @BelongsTo(() => TaskStatusModel)
  status: TaskStatusEntity
}

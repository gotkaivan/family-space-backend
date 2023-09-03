import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { TaskModel } from './task.model'
import { TaskEntity } from '../entity/task.entity'
import { CreateTaskPositionDto } from '../dto/request/create-task-position.dto'

@Table({ tableName: 'task-positions' })
export class TaskPositionModel extends Model<TaskPositionModel, CreateTaskPositionDto> {
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

  @ForeignKey(() => TaskModel)
  @ApiProperty({ example: '1', description: 'ID задачи' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  taskId: number

  @BelongsTo(() => TaskModel)
  task: TaskEntity
}

import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { TaskModel } from './task.model'
import { AttachTaskToUser } from '../dto/request/attach-task-to-user'

@Table({ tableName: 'task-users', createdAt: false, updatedAt: false })
export class TaskUserModel extends Model<TaskUserModel, AttachTaskToUser> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ForeignKey(() => TaskModel)
  @ApiProperty({ example: '1' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  taskId: number

  @ForeignKey(() => UserModel)
  @ApiProperty({ example: '3' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number
}

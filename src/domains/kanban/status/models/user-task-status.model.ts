import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { AttachTaskStatusToUserDto } from '../dto/request/attach-task-status-to-user.dto'
import { TaskStatusModel } from './task-status.model'

@Table({ tableName: 'user-task-statuses', createdAt: false, updatedAt: false })
export class UserTaskStatusModel extends Model<UserTaskStatusModel, AttachTaskStatusToUserDto> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ForeignKey(() => TaskStatusModel)
  @ApiProperty({ example: '1' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  statusId: number

  @ForeignKey(() => UserModel)
  @ApiProperty({ example: '3' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number
}

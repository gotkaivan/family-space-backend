import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { SubtaskModel } from './subtask.model'
import { AttachSubtaskToUser } from '../dto/request/attach-subtask-to-user'

@Table({ tableName: 'subtask-users', createdAt: false, updatedAt: false })
export class SubtaskUserModel extends Model<SubtaskUserModel, AttachSubtaskToUser> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ForeignKey(() => SubtaskModel)
  @ApiProperty({ example: '1' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  subtaskId: number

  @ForeignKey(() => UserModel)
  @ApiProperty({ example: '3' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number
}

import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { AttachNoteBoardToUser } from '../dto/request/attach-note-board-to-user'
import { NoteBoardModel } from './note-board.model'

@Table({ tableName: 'note-boards-users', createdAt: false, updatedAt: false })
export class NoteBoardUserModel extends Model<NoteBoardUserModel, AttachNoteBoardToUser> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ForeignKey(() => NoteBoardModel)
  @ApiProperty({ example: '1' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  boardId: number

  @ForeignKey(() => UserModel)
  @ApiProperty({ example: '3' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number
}

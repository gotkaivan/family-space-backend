import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { BoardModel } from './board.model'
import { AttachBoardToUser } from '../dto/request/attach-board-to-user'

@Table({ tableName: 'user-board', createdAt: false, updatedAt: false })
export class BoardUserModel extends Model<BoardUserModel, AttachBoardToUser> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ForeignKey(() => BoardModel)
  @ApiProperty({ example: '1' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  groupId: number

  @ForeignKey(() => UserModel)
  @ApiProperty({ example: '3' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number
}

import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { NoteGroupModel } from './note-group.model'
import { AttachNoteGroupToUser } from '../dto/request/attach-note-group-to-user'

@Table({ tableName: 'note-groups-users', createdAt: false, updatedAt: false })
export class NoteGroupUserModel extends Model<NoteGroupUserModel, AttachNoteGroupToUser> {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ForeignKey(() => NoteGroupModel)
  @ApiProperty({ example: '1' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  boardId: number

  @ForeignKey(() => UserModel)
  @ApiProperty({ example: '3' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number
}

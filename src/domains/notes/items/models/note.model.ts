import { ApiProperty } from '@nestjs/swagger'
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'
import { NoteUserModel } from './note-user.model'
import { CreateNoteDto } from '../dto/request/create-note.dto'
import { NoteBoardModel } from '../../boards/models/note-board.model'
import { NoteBoardEntity } from '../../boards/entity/note-board.entity'

@Table({ tableName: 'notes', createdAt: 'created', updatedAt: 'updated' })
export class NoteModel extends Model<NoteModel, CreateNoteDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Заметка', description: 'Название заметки' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string

  @ApiProperty({ example: 'Описание заметки', description: 'Описание заметки' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string

  @ApiProperty({ example: 'Контент заметки', description: 'Контент заметки' })
  @Column({ type: DataType.STRING, allowNull: false })
  content: string

  @ApiProperty({ example: false, description: 'Закреп заметки' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isFavorite: boolean

  @ForeignKey(() => NoteBoardModel)
  @ApiProperty({ example: '1', description: 'ID набора заметок' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  boardId: number

  @BelongsToMany(() => UserModel, () => NoteUserModel)
  user: UserEntity[]

  @BelongsTo(() => NoteBoardModel)
  board: NoteBoardEntity
}

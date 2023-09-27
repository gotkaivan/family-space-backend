import { ApiProperty } from '@nestjs/swagger'
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'
import { CreateNoteBoardDto } from '../dto/request/create-note-board.dto'
import { NoteEntity } from '../../items/entity/note.entity'
import { NoteModel } from '../../items/models/note.model'
import { NoteUserModel } from '../../items/models/note-user.model'
import { NoteBoardUserModel } from './note-board-user.model'

@Table({ tableName: 'note-boards', createdAt: 'created', updatedAt: 'updated' })
export class NoteBoardModel extends Model<NoteBoardModel, CreateNoteBoardDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Задача', description: 'Название задачи' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string

  @ApiProperty({ example: 'Описание задачи', description: 'Описание задачи' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string

  @ApiProperty({ example: false, description: 'Закреп набора' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isFavorite: boolean

  @BelongsToMany(() => UserModel, () => NoteBoardUserModel)
  user: UserEntity[]

  @HasMany(() => NoteModel)
  notes: NoteEntity[]
}

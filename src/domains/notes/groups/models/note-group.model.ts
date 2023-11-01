import { ApiProperty } from '@nestjs/swagger'
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'
import { CreateNoteGroupDto } from '../dto/request/create-note-group.dto'
import { NoteEntity } from '../../items/entity/note.entity'
import { NoteModel } from '../../items/models/note.model'
import { NoteGroupUserModel } from './note-group-user.model'

@Table({ tableName: 'note-groups', createdAt: 'created', updatedAt: 'updated' })
export class NoteGroupModel extends Model<NoteGroupModel, CreateNoteGroupDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Группа заметок', description: 'Название набора заметок' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string

  @ApiProperty({ example: 'Описание группы заметок', description: 'Описание набора заметок' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string

  @ApiProperty({ example: '1000000', description: 'Позиция набора заметок' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  position: number

  @ApiProperty({ example: false, description: 'Закреп набора' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isFavorite: boolean

  @BelongsToMany(() => UserModel, () => NoteGroupUserModel)
  user: UserEntity[]

  @HasMany(() => NoteModel)
  notes: NoteEntity[]
}

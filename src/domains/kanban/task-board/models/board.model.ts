import { ApiProperty } from '@nestjs/swagger'
import { BelongsToMany, Column, DataType, HasOne, Model, Table } from 'sequelize-typescript'
import { UserModel } from 'src/domains/users/user.model'
import { UserEntity } from 'src/domains/users/entity/user.entity'
import { TaskStatusModel } from '../../status/models/task-status.model'
import { TaskStatusEntity } from '../../status/entity/task-status.entity'
import { CreateBoardDto } from '../dto/request/create-board.dto'
import { BoardUserModel } from './board-user.model'

@Table({ tableName: 'boards', createdAt: 'created', updatedAt: 'updated' })
export class BoardModel extends Model<BoardModel, CreateBoardDto> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Группа', description: 'Название группы' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string

  @ApiProperty({ example: 'Описание группы', description: 'Описание группы' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string

  @ApiProperty({ example: '1000000', description: 'Позиция группы' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  position: number

  @ApiProperty({ example: false, description: 'Закреп группы' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isFavorite: boolean

  @BelongsToMany(() => UserModel, () => BoardUserModel)
  user: UserEntity[]

  @HasOne(() => TaskStatusModel)
  statuses: TaskStatusEntity[]
}

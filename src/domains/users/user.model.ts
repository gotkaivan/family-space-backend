import { ApiProperty } from '@nestjs/swagger'
import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { IUser } from './types'

@Table({ tableName: 'users', createdAt: 'created', updatedAt: 'updated' })
export class UserModel extends Model<UserModel, IUser> {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string

  @ApiProperty({ example: 'email@mail.ru', description: 'E-mail пользователя' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string

  @ApiProperty({ example: 'password1234', description: 'Пароль пользователя' })
  @Column({ type: DataType.STRING, allowNull: true })
  password: string
}

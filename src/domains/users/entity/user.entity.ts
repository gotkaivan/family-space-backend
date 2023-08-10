import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, Length } from 'class-validator'
import { IUser } from '../types'

export class UserEntity implements IUser {
  @ApiProperty({ example: 'id', description: 'Идентификатор пользователя' })
  @IsString({ message: '' })
  readonly id: number

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string

  @ApiProperty({ example: 'gotka_gva@mail.ru', description: 'E-mail пользователя' })
  @IsEmail({}, { message: 'Должно быть email формата' })
  @IsString({ message: 'Должно быть строкой' })
  readonly email: string

  @ApiProperty({ example: 'password', description: 'Пароль пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
  readonly password: string
}

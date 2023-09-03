import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import jwt_decode from 'jwt-decode'

import { UserModel } from './user.model'
import { IUser } from './types'
import { UserEntity } from './entity/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserWithPassword } from './dto/user-with-pawwrord.dto'
import { UserDto } from './dto/user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel) private userRepository: typeof UserModel) {}
  async createUser(dto: UserWithPassword): Promise<UserEntity> {
    return await this.userRepository.create(dto)
  }

  async getAllUsers(): Promise<UserDto[]> {
    return await this.userRepository.findAll({ attributes: { exclude: ['password'] } })
  }

  async getUserByEmail(email: string): Promise<UserWithPassword> {
    const user = await this.userRepository.findOne({
      raw: true,
      where: { email },
      include: { all: true },
    })

    if (!user) throw new HttpException('Пользователь по такому email не найден', HttpStatus.NOT_FOUND)

    return user
  }

  async getUserById(id: number): Promise<IUser> {
    const user = await this.userRepository.findOne({
      raw: true,
      where: { id },
      include: { all: true },
    })

    if (!user) throw new NotFoundException({ message: 'Пользователь по такому id не найден' })

    const { password, ...other } = user
    return {
      ...other,
    }
  }

  async getUserByEmailWithoutPassword(email: string): Promise<IUser> {
    console.log(email)
    const user = await this.userRepository.findOne({
      raw: true,
      where: { email },
      include: { all: true },
    })

    console.log(user)

    if (!user) throw new NotFoundException({ message: 'Пользователь по такому id не найден' })

    const { password, ...other } = user
    return {
      ...other,
    }
  }

  async getUserByToken(token: string): Promise<IUser> {
    const { email } = jwt_decode<UserEntity>(token)
    return await this.getUserByEmailWithoutPassword(email)
  }

  async checkUniqueUser(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      raw: true,
      where: {
        [Op.or]: [{ email }],
      },
      include: { all: true },
    })
    return !!user
  }

  async updateUser(id: number, requestUser: UpdateUserDto) {
    return await this.userRepository.update({ ...requestUser }, { where: { id } })
  }
}

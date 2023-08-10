import { Injectable } from '@nestjs/common'
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
    return await this.userRepository.findOne({
      raw: true,
      where: { email },
      include: { all: true },
    })
  }

  async getUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      raw: true,
      where: { id },
      include: { all: true },
    })
  }

  async getUserByEmailWithoutPassword(email: string): Promise<IUser | null> {
    const user = await this.userRepository.findOne({
      raw: true,
      where: { email },
    })

    if (!user) return null

    const { password, ...other } = user
    return {
      ...other,
    }
  }

  async getUserByToken(token: string | null): Promise<IUser | null> {
    if (!token) return null
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

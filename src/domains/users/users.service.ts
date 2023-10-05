import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { UserModel } from './user.model'
import { UserEntity } from './entity/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { getBadRequest } from 'src/common/helpers'

import jwt_decode from 'jwt-decode'

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel) private userRepository: typeof UserModel) {}

  /**
   * Метод создания пользователя
   * @param user UserEntity
   * @returns Promise<UserDto>
   */

  async createUser(dto: UserEntity): Promise<UserDto> {
    try {
      const { password, ...createdUser } = await this.userRepository.create(dto)
      return createdUser
    } catch (e) {
      getBadRequest('Не удалось создать пользователя')
    }
  }

  /**
   * Метод получения всех пользователей
   * @returns Promise<UserDto[]>
   */

  async getAllUsers(): Promise<UserDto[]> {
    try {
      return await this.userRepository.findAll({ attributes: { exclude: ['password'] } })
    } catch (e) {
      getBadRequest('Не удалось получить пользователей')
    }
  }

  /**
   * Метод получения пользователя по Email
   * @param email string
   * @returns Promise<UserEntity>
   */

  async getUserByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        raw: true,
        where: { email },
        include: { all: true },
      })

      if (!user) throw new HttpException('Пользователь по такому email не найден', HttpStatus.NOT_FOUND)

      return user
    } catch (e) {
      getBadRequest('Не удалось получить пользователя по Email')
    }
  }

  /**
   * Метод получения пользователя по ID
   * @param id number
   * @returns Promise<UserDto>
   */

  async getUserById(id: number): Promise<UserDto> {
    try {
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
    } catch (e) {
      getBadRequest('Не удалось найти пользователя по ID')
    }
  }

  /**
   * Метод получения пользователя по Email без пароля
   * @param id number
   * @returns Promise<UserDto>
   */

  async getUserByEmailWithoutPassword(email: string): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOne({
        raw: true,
        where: { email },
        include: { all: true },
      })

      if (!user) throw new NotFoundException({ message: 'Пользователь по такому id не найден' })

      const { password, ...other } = user
      return {
        ...other,
      }
    } catch (e) {
      getBadRequest('Не удалось найти пользователя по ID')
    }
  }

  /**
   * Метод получения пользователя по токену без пароля
   * @param token string
   * @returns Promise<UserDto>
   */

  async getUserByToken(token: string): Promise<UserDto> {
    try {
      const { email } = jwt_decode<UserEntity>(token)
      return await this.getUserByEmailWithoutPassword(email)
    } catch (e) {
      getBadRequest('Не удалось получить пользователя по токену')
    }
  }

  /**
   * Метод проверки уникальности пользователя
   * @param email string
   * @returns Promise<boolean>
   */

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

  /**
   * Метод обновления пользователя
   * @param id number
   * @param requestUser UpdateUserDto
   */

  async updateUser(id: number, requestUser: UpdateUserDto) {
    try {
      return await this.userRepository.update({ ...requestUser }, { where: { id } })
    } catch (e) {
      getBadRequest('Не удалось обновить пользователя')
    }
  }
}

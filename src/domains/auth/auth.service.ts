import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/domains/users/users.service'
import * as bcrypt from 'bcryptjs'
import { LoginRequestDto } from './dto/login-request.dto'
import { LOCAL_TOKEN } from 'src/configs'
import { UserEntity } from '../users/entity/user.entity'
import { UserDto } from '../users/dto/user.dto'

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  /**
   * Метод аутентификации пользователя
   * @param user UserEntity
   * @param response Response
   * @returns Promise<AuthResponseDto>
   */

  async login({ user: userEntity, response }): Promise<UserDto> {
    const user = await this.validateUser(userEntity)

    if (user) {
      response.cookie(LOCAL_TOKEN, this.generateToken(user), {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
      })
    }

    return this.getUserResponse(user)
  }

  /**
   * Метод регистрации пользователя
   * @param user UserEntity
   * @param response Response
   * @returns Promise<AuthResponseDto>
   */

  async register({ user: userEntity, response }): Promise<UserDto> {
    const defaultUser = {
      name: '',
    }

    const isUserFound = await this.userService.checkUniqueUser(userEntity.email)

    if (isUserFound) {
      throw new HttpException(
        { message: 'Пользователь с таким логином или e-mail уже существует' },
        HttpStatus.BAD_REQUEST
      )
    }

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = await bcrypt.hashSync(userEntity.password, salt)

    await this.userService.createUser({
      ...defaultUser,
      ...userEntity,
      password: hashPassword,
    })

    const user = await this.userService.getUserByEmail(userEntity.email)

    response.cookie(LOCAL_TOKEN, this.generateToken(user), {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    })

    return user
  }

  /**
   * Метод разлогирования пользователя
   * @returns Promise<void>
   */

  async logout(response): Promise<void> {
    response.cookie('jwt', '', { expires: new Date() })
  }

  /**
   * Метод генерации токена
   * @param user UserEntity
   * @returns string
   */

  private generateToken(user: UserDto): string {
    const payload = { email: user.email }
    return this.jwtService.sign(payload)
  }

  /**
   * Метод валидации пользователя
   * @param userDto LoginRequestDto
   * @returns Promise<UserEntity>
   */

  async validateUser(userDto: LoginRequestDto): Promise<UserEntity> {
    const user = await this.userService.getUserByEmail(userDto.email)

    if (!user) throw new UnauthorizedException({ message: 'Email не найден' })

    const passwordEquals = await bcrypt.compare(userDto.password, user.password)

    if (passwordEquals) return user
    throw new UnauthorizedException({
      message: 'Неверный пароль',
    })
  }

  /**
   * Вспомогательный метод формирования пользователя без пароля
   * @param user UserEntity
   * @returns UserDto
   */

  private getUserResponse(user: UserEntity): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }
}

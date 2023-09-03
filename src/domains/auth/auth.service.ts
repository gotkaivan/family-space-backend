import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/domains/users/users.service'
import * as bcrypt from 'bcryptjs'
import { LoginRequestDto } from './dto/login-request.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { LOCAL_TOKEN } from 'src/configs'
import { UserEntity } from '../users/entity/user.entity'
import { IUser } from '../users/types'

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async login({ user: userEntity }): Promise<AuthResponseDto> {
    const user = await this.validateUser(userEntity)

    // var date = new Date()
    // date.setDate(date.getDate() + 7)

    // if (user) {
    //   response.cookie(LOCAL_TOKEN, this.generateToken(user), {
    //     secure: true, //--> SET TO TRUE ON PRODUCTION,
    //     httpOnly: false,
    //     withCredentials: 'include',
    //     sameSite: 'none',
    //     expire: date,
    //   })
    // }

    return { user: this.getUserResponse(user), token: this.generateToken(user) }
  }

  async register({ user: userEntity }): Promise<AuthResponseDto> {
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

    const user = await this.userService.createUser({
      ...defaultUser,
      ...userEntity,
      password: hashPassword,
    })

    return { user: this.getUserResponse(user), token: this.generateToken(user) }
  }

  async logout(response): Promise<void> {
    response.cookie('jwt', '', { expires: new Date() })
    return
  }

  private generateToken(user) {
    const payload = { email: user.email }
    return this.jwtService.sign(payload)
  }

  async validateUser(userDto: LoginRequestDto): Promise<UserEntity> {
    const user = await this.userService.getUserByEmail(userDto.email)
    if (!user) throw new UnauthorizedException({ message: 'Email не найден' })

    const passwordEquals = await bcrypt.compare(userDto.password, user.password)

    if (passwordEquals) return user
    throw new UnauthorizedException({
      message: 'Неверный пароль',
    })
  }

  private getUserResponse(user: UserEntity): IUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }
}

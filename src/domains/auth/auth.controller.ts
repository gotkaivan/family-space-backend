import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { LoginRequestDto } from './dto/login-request.dto'
import { RegisterRequestDto } from './dto/register-request.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { UserDto } from '../users/dto/user.dto'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiBody({ type: LoginRequestDto })
  @ApiUnauthorizedResponse({ description: 'Неверные входные данные' })
  public login(@Body() user: LoginRequestDto, @Res({ passthrough: true }) response: Response): Promise<UserDto> {
    return this.authService.login({ user, response })
  }

  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, type: UserDto })
  @ApiBody({ type: RegisterRequestDto })
  @ApiUnauthorizedResponse({ description: 'Неверные входные данные' })
  public register(@Body() user: RegisterRequestDto, @Res({ passthrough: true }) response: Response): Promise<UserDto> {
    return this.authService.register({ user, response })
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: ResponseType): Promise<void> {
    return this.authService.logout(response)
  }
}

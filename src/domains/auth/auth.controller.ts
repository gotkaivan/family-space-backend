import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { LoginRequestDto } from './dto/login-request.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { RegisterRequestDto } from './dto/register-request.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiBody({ type: LoginRequestDto })
  @ApiUnauthorizedResponse({ description: 'Неверные входные данные' })
  public login(@Body() user: LoginRequestDto): Promise<AuthResponseDto> {
    return this.authService.login({ user })
  }

  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiBody({ type: RegisterRequestDto })
  @ApiUnauthorizedResponse({ description: 'Неверные входные данные' })
  public register(@Body() user: RegisterRequestDto): Promise<AuthResponseDto> {
    return this.authService.register({ user })
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: ResponseType): Promise<void> {
    return this.authService.logout(response)
  }
}

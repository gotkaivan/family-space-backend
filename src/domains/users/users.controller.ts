import { Controller, Get, UseGuards, UsePipes, Req, Patch, Param, Body } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiCookieAuth, ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { ValidationPipe } from 'src/pipes/validation.pipe'
import { UserModel } from './user.model'
import { UsersService } from './users.service'
import { getLocalToken } from 'src/helpers/getLocalToken'
import { UserEntity } from './entity/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { UserWithPassword } from './dto/user-with-pawwrord.dto'

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {
    this.userService = userService
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [UserModel] })
  @UsePipes(ValidationPipe)
  @Get()
  public async getAllUsers(): Promise<UserDto[]> {
    return this.userService.getAllUsers()
  }

  @Get('/by-token')
  public getUserByToken(@Req() request: Request): Promise<UserDto> {
    return this.userService.getUserByToken(getLocalToken(request))
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() requestUser: UpdateUserDto) {
    return this.userService.updateUser(+id, requestUser)
  }
}

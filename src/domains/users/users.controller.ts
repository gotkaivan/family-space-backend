import { Controller, Get, UseGuards, Req, Patch, Param, Body, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { getTokenByRequest } from 'src/helpers'
import { Request } from 'express'

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {
    this.userService = userService
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [UserDto] })
  @Get()
  public async getAllUsers(): Promise<UserDto[]> {
    return this.userService.getAllUsers()
  }

  @ApiOperation({ summary: 'Получение пользователя по токену' })
  @ApiResponse({ status: 200, type: UserDto })
  @Post('/by-token')
  public getUserByToken(@Req() request: Request): Promise<UserDto> {
    return this.userService.getUserByToken(getTokenByRequest(request))
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() requestUser: UpdateUserDto) {
    return this.userService.updateUser(+id, requestUser)
  }
}

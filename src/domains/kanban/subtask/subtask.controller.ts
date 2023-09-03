import { Controller, UseGuards, Body, Post, Req, Get, Param, Delete, Patch } from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { SubtaskService } from './subtask.service'
import { SubtaskDto } from './dto/subtask.dto'
import { getTokenByRequest } from 'src/helpers'
import { CreateSubtaskDto } from './dto/request/create-subtask.dto'
import { UpdateSubtaskDto } from './dto/request/update-subtask.dto'
import { CreateSubtaskResponseDto } from './dto/response/create-subtask.dto'
import { UpdateSubtaskResponseDto } from './dto/response/update-subtask.dto'
import { DeleteSubtaskResponseDto } from './dto/response/delete-subtask.dto'

@Controller('subtask')
@ApiTags('Subtask')
export class SubtaskController {
  constructor(private subtaskService: SubtaskService) {
    this.subtaskService = subtaskService
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех подзадач по ID задачи' })
  @ApiResponse({ status: 200, type: [SubtaskDto] })
  @Get('all/:id')
  public async getSubtasks(@Param('id') id: number, @Req() request: Request): Promise<SubtaskDto[]> {
    return this.subtaskService.getSubtasks(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение подзадачи' })
  @ApiResponse({ status: 200, type: SubtaskDto })
  @Get(':id')
  public async getSubtaskById(@Param('id') id: number, @Req() request: Request): Promise<SubtaskDto> {
    return this.subtaskService.getSubtaskById(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание подзадачи' })
  @ApiResponse({ status: 200, type: SubtaskDto })
  @Post('create')
  public async createSubtask(@Body() subtask: CreateSubtaskDto, @Req() request: Request): Promise<SubtaskDto> {
    return this.subtaskService.createSubtask(getTokenByRequest(request), subtask)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление подзадачи' })
  @ApiResponse({ status: 200, type: SubtaskDto })
  @Patch()
  updateSubtask(@Body() subtask: UpdateSubtaskDto, @Req() request: Request): Promise<UpdateSubtaskResponseDto> {
    return this.subtaskService.updateSubtask(getTokenByRequest(request), subtask)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление подзадачи' })
  @ApiResponse({ status: 200, type: DeleteSubtaskResponseDto })
  @Delete(':id')
  deleteSubtask(@Param('id') id: number): Promise<DeleteSubtaskResponseDto> {
    return this.subtaskService.deleteSubtask(id)
  }
}

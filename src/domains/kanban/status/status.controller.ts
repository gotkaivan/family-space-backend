import { Controller, UseGuards, Post, Req, Body, Delete, Patch, Param, Get } from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { getTokenByRequest } from 'src/helpers'
import { TaskStatusDto } from './dto/task-status.dto'
import { CreateTaskStatusDto } from './dto/request/create-task-status.dto'
import { TaskStatusService } from './status.service'
import { DeleteTaskStatusResponseDto } from './dto/response/delete-task-status.dto'

@Controller('task-status')
@ApiTags('Status')
export class StatusController {
  constructor(private taskStatusService: TaskStatusService) {
    this.taskStatusService = taskStatusService
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех статусов' })
  @ApiResponse({ status: 200, type: [TaskStatusDto] })
  @Get('all')
  public async getStatuses(@Req() request: Request): Promise<TaskStatusDto[]> {
    return this.taskStatusService.getTaskStatuses(getTokenByRequest(request))
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение статуса' })
  @ApiResponse({ status: 200, type: TaskStatusDto })
  @Get(':id')
  public async getStatusById(@Param('id') id: number, @Req() request: Request): Promise<TaskStatusDto> {
    return this.taskStatusService.getTaskStatusById(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание статуса' })
  @ApiResponse({ status: 201, type: TaskStatusDto })
  @ApiBody({ type: CreateTaskStatusDto })
  @Post('create')
  public async createStatus(@Body() status: CreateTaskStatusDto, @Req() request: Request): Promise<TaskStatusDto> {
    return this.taskStatusService.createTaskStatus(getTokenByRequest(request), status)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление статуса' })
  @ApiResponse({ status: 200, type: TaskStatusDto })
  @Patch()
  updateStatus(@Body() status: TaskStatusDto, @Req() request: Request): Promise<TaskStatusDto> {
    return this.taskStatusService.updateTaskStatus(getTokenByRequest(request), status)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление статуса' })
  @ApiResponse({ status: 200, type: DeleteTaskStatusResponseDto })
  @Delete(':id')
  deleteStatus(@Param('id') id: number): Promise<DeleteTaskStatusResponseDto> {
    return this.taskStatusService.deleteTaskStatus(id)
  }
}

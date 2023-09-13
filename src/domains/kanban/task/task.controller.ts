import { TaskService } from './task.service'
import { Controller, UseGuards, Body, Post, Req, Patch, Delete, Get, Param } from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { TaskDto } from './dto/task.dto'
import { getTokenByRequest } from 'src/helpers'
import { CreateTaskDto } from './dto/request/create-task.dto'
import { CreateTaskResponseDto } from './dto/response/create-task.dto'
import { UpdateTaskResponseDto } from './dto/response/update-task.dto'
import { DeleteTaskResponseDto } from './dto/response/delete-task.dto'

@Controller('tasks')
@ApiTags('Task')
export class TaskController {
  constructor(private taskService: TaskService) {
    this.taskService = taskService
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех колонок по ID колонки' })
  @ApiResponse({ status: 200, type: [TaskDto] })
  @Get(':id')
  public async getTasks(@Param('id') id: number, @Req() request: Request): Promise<TaskDto[]> {
    return this.taskService.getTasks(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение задачи' })
  @ApiResponse({ status: 200, type: TaskDto })
  @Get('task/:id')
  public async getTaskById(@Param('id') id: number, @Req() request: Request): Promise<TaskDto> {
    return this.taskService.getTaskById(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание задачи' })
  @ApiResponse({ status: 201, type: TaskDto })
  @Post('create')
  public async createTask(@Body() task: CreateTaskDto, @Req() request: Request): Promise<CreateTaskResponseDto> {
    return this.taskService.createTask(getTokenByRequest(request), task)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление задачи' })
  @ApiResponse({ status: 200, type: TaskDto })
  @Patch()
  updateTask(@Body() task: TaskDto, @Req() request: Request): Promise<UpdateTaskResponseDto> {
    return this.taskService.updateTask(getTokenByRequest(request), task)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление задачи' })
  @ApiResponse({ status: 200, type: DeleteTaskResponseDto })
  @Delete(':id')
  deleteTask(@Param('id') id: number): Promise<DeleteTaskResponseDto> {
    return this.taskService.deleteTask(id)
  }
}

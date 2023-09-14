import { BoardService } from './board.service'
import { Controller, UseGuards, Body, Post, Req, Patch, Delete, Get, Param } from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { getTokenByRequest } from 'src/helpers'
import { BoardDto } from './dto/task-group.dto'
import { CreateBoardDto } from './dto/request/create-board.dto'
import { CreateBoardResponseDto } from './dto/response/create-board.dto'
import { DeleteBoardResponseDto } from './dto/response/delete-board.dto'
import { UpdateBoardResponseDto } from './dto/response/update-board.dto'

@Controller('boards')
@ApiTags('Boards')
export class BoardController {
  constructor(private boardService: BoardService) {
    this.boardService = boardService
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех колонок по ID колонки' })
  @ApiResponse({ status: 200, type: [BoardDto] })
  @Get()
  public async getBoards(@Req() request: Request): Promise<BoardDto[]> {
    return this.boardService.getBoards(getTokenByRequest(request))
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение задачи' })
  @ApiResponse({ status: 200, type: BoardDto })
  @Get(':id')
  public async getBoardById(@Param('id') id: number, @Req() request: Request): Promise<BoardDto> {
    return this.boardService.getBoardById(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание задачи' })
  @ApiResponse({ status: 201, type: BoardDto })
  @Post('create')
  public async createBoard(@Body() task: CreateBoardDto, @Req() request: Request): Promise<CreateBoardResponseDto> {
    return this.boardService.createBoard(getTokenByRequest(request), task)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление задачи' })
  @ApiResponse({ status: 200, type: BoardDto })
  @Patch()
  updateBoard(@Body() task: BoardDto, @Req() request: Request): Promise<UpdateBoardResponseDto> {
    return this.boardService.updateBoard(getTokenByRequest(request), task)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление задачи' })
  @ApiResponse({ status: 200, type: DeleteBoardResponseDto })
  @Delete(':id')
  deleteBoard(@Param('id') id: number): Promise<DeleteBoardResponseDto> {
    return this.boardService.deleteBoard(id)
  }
}

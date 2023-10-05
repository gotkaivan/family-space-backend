import { NoteBoardsService } from './note-boards.service'

import { Controller, UseGuards, Body, Post, Req, Patch, Delete, Get, Param } from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { getTokenByRequest } from 'src/common/helpers'
import { NoteBoardDto } from './dto/note.dto'
import { CreateNoteBoardResponseDto } from './dto/response/create-note-board.dto'
import { CreateNoteBoardDto } from './dto/request/create-note-board.dto'
import { DeleteNoteBoardResponseDto } from './dto/response/delete-note-board.dto'
import { UpdateNoteBoardResponseDto } from './dto/response/update-note-board.dto'

@Controller('note-boards')
@ApiTags('NoteBoards')
export class NoteBoardsController {
  constructor(private readonly noteBoardsService: NoteBoardsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех наборов с заметками' })
  @ApiResponse({ status: 200, type: [NoteBoardDto] })
  @Get()
  public async getNoteBoards(@Req() request: Request): Promise<NoteBoardDto[]> {
    return this.noteBoardsService.getNoteBoards(getTokenByRequest(request))
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение набора с заметками' })
  @ApiResponse({ status: 200, type: NoteBoardDto })
  @Get(':id')
  public async getNoteBoardById(@Param('id') id: number, @Req() request: Request): Promise<NoteBoardDto> {
    return this.noteBoardsService.getNoteBoardById(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание набора с заметками' })
  @ApiResponse({ status: 201, type: CreateNoteBoardResponseDto })
  @Post('create')
  public async createNoteBoard(
    @Body() board: CreateNoteBoardDto,
    @Req() request: Request
  ): Promise<CreateNoteBoardResponseDto> {
    return this.noteBoardsService.createNoteBoard(getTokenByRequest(request), board)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление набора с заметками' })
  @ApiResponse({ status: 200, type: UpdateNoteBoardResponseDto })
  @Patch()
  updateNoteBoard(@Body() board: NoteBoardDto, @Req() request: Request): Promise<UpdateNoteBoardResponseDto> {
    return this.noteBoardsService.updateNoteBoard(getTokenByRequest(request), board)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление набора с заметками' })
  @ApiResponse({ status: 200, type: DeleteNoteBoardResponseDto })
  @Delete(':id')
  deleteNoteBoard(@Param('id') id: number): Promise<DeleteNoteBoardResponseDto> {
    return this.noteBoardsService.deleteNoteBoard(id)
  }
}

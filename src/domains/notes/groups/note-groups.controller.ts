import { NoteBoardsService } from './note-groups.service'

import { Controller, UseGuards, Body, Post, Req, Patch, Delete, Get, Param } from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { getTokenByRequest } from 'src/common/helpers'
import { NoteGroupDto } from './dto/note-group.dto'
import { DeleteNoteGroupResponseDto } from './dto/response/delete-note-board.dto'
import { UpdateNoteGroupResponseDto } from './dto/response/update-note-board.dto'
import { CreateNoteGroupResponseDto } from './dto/response/create-note-board.dto'
import { CreateNoteGroupDto } from './dto/request/create-note-group.dto'

@Controller('note-boards')
@ApiTags('NoteBoards')
export class NoteBoardsController {
  constructor(private readonly noteBoardsService: NoteBoardsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех наборов с заметками' })
  @ApiResponse({ status: 200, type: [NoteGroupDto] })
  @Get()
  public async getNoteBoards(@Req() request: Request): Promise<NoteGroupDto[]> {
    return this.noteBoardsService.getNoteBoards(getTokenByRequest(request))
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение набора с заметками' })
  @ApiResponse({ status: 200, type: NoteGroupDto })
  @Get(':id')
  public async getNoteBoardById(@Param('id') id: number, @Req() request: Request): Promise<NoteGroupDto> {
    return this.noteBoardsService.getNoteBoardById(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание набора с заметками' })
  @ApiResponse({ status: 201, type: CreateNoteGroupResponseDto })
  @Post('create')
  public async createNoteBoard(
    @Body() board: CreateNoteGroupDto,
    @Req() request: Request
  ): Promise<CreateNoteGroupResponseDto> {
    return this.noteBoardsService.createNoteBoard(getTokenByRequest(request), board)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление набора с заметками' })
  @ApiResponse({ status: 200, type: UpdateNoteGroupResponseDto })
  @Patch()
  updateNoteBoard(@Body() board: NoteGroupDto, @Req() request: Request): Promise<UpdateNoteGroupResponseDto> {
    return this.noteBoardsService.updateNoteBoard(getTokenByRequest(request), board)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление набора с заметками' })
  @ApiResponse({ status: 200, type: DeleteNoteGroupResponseDto })
  @Delete(':id')
  deleteNoteBoard(@Param('id') id: number): Promise<DeleteNoteGroupResponseDto> {
    return this.noteBoardsService.deleteNoteBoard(id)
  }
}

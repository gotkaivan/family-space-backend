import { Controller, UseGuards, Body, Post, Req, Patch, Delete, Get, Param } from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { getTokenByRequest } from 'src/helpers'
import { NoteDto } from './dto/note.dto'
import { NotesService } from './notes.service'
import { CreateNoteDto } from './dto/request/create-note.dto'
import { CreateNoteResponseDto } from './dto/response/create-note.dto'
import { UpdateNoteResponseDto } from './dto/response/update-task.dto'
import { DeleteNoteResponseDto } from './dto/response/delete-note.dto'

@Controller('note')
@ApiTags('Notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение заметок по ID набора' })
  @ApiResponse({ status: 200, type: [NoteDto] })
  @Get('all/:id')
  public async getNotes(@Param('id') id: number, @Req() request: Request): Promise<NoteDto[]> {
    return this.notesService.getNotes(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение заметки по ID' })
  @ApiResponse({ status: 200, type: NoteDto })
  @Get(':id')
  public async getNoteById(@Param('id') id: number, @Req() request: Request): Promise<NoteDto> {
    return this.notesService.getNoteById(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание заметки' })
  @ApiResponse({ status: 201, type: CreateNoteResponseDto })
  @Post('create')
  public async createNote(@Body() note: CreateNoteDto, @Req() request: Request): Promise<CreateNoteResponseDto> {
    return this.notesService.createNote(getTokenByRequest(request), note)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление заметки' })
  @ApiResponse({ status: 200, type: UpdateNoteResponseDto })
  @Patch()
  updateNote(@Body() note: NoteDto, @Req() request: Request): Promise<UpdateNoteResponseDto> {
    return this.notesService.updateNote(getTokenByRequest(request), note)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление заметки' })
  @ApiResponse({ status: 200, type: DeleteNoteResponseDto })
  @Delete(':id')
  deleteNote(@Param('id') id: number): Promise<DeleteNoteResponseDto> {
    return this.notesService.deleteNote(id)
  }
}

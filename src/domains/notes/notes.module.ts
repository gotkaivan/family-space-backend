import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { NotesController } from './items/notes.controller'
import { NotesService } from './items/notes.service'
import { NoteBoardsService } from './boards/note-boards.service'
import { NoteBoardsController } from './boards/note-boards.controller'
import { NoteModel } from './items/models/note.model'
import { NoteBoardModel } from './boards/models/note-board.model'
import { NoteBoardUserModel } from './boards/models/note-board-user.model'
import { NoteUserModel } from './items/models/note-user.model'
import { UsersService } from '../users/users.service'
import { UserModel } from '../users/user.model'

@Module({
  controllers: [NotesController, NoteBoardsController],
  imports: [SequelizeModule.forFeature([NoteModel, NoteBoardModel, NoteUserModel, NoteBoardUserModel, UserModel])],
  providers: [NotesService, NoteBoardsService, UsersService],
})
export class NotesModule {}

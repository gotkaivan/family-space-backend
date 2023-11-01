import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { NotesController } from './items/notes.controller'
import { NotesService } from './items/notes.service'
import { NoteBoardsService } from './groups/note-groups.service'
import { NoteBoardsController } from './groups/note-groups.controller'
import { NoteModel } from './items/models/note.model'
import { NoteUserModel } from './items/models/note-user.model'
import { UsersService } from '../users/users.service'
import { UserModel } from '../users/user.model'
import { NoteGroupModel } from './groups/models/note-group.model'
import { NoteGroupUserModel } from './groups/models/note-group-user.model'

@Module({
  controllers: [NotesController, NoteBoardsController],
  imports: [SequelizeModule.forFeature([NoteModel, NoteGroupModel, NoteUserModel, NoteGroupUserModel, UserModel])],
  providers: [NotesService, NoteBoardsService, UsersService],
})
export class NotesModule {}

import { OmitType } from '@nestjs/swagger'
import { NoteEntity } from '../../entity/note.entity'

export class CreateNoteDto extends OmitType(NoteEntity, ['id'] as const) {}

import { PickType } from '@nestjs/swagger'
import { NoteEntity } from '../../entity/note.entity'

export class UpdateNoteResponseDto extends PickType(NoteEntity, ['id'] as const) {}

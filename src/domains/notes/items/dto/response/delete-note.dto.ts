import { PickType } from '@nestjs/swagger'
import { NoteEntity } from '../../entity/note.entity'

export class DeleteNoteResponseDto extends PickType(NoteEntity, ['id'] as const) {}

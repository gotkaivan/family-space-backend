import { PickType } from '@nestjs/swagger'
import { NoteGroupEntity } from '../../entity/note-group.entity'

export class CreateNoteGroupResponseDto extends PickType(NoteGroupEntity, ['id'] as const) {}

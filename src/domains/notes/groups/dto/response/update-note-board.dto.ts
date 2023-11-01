import { PickType } from '@nestjs/swagger'
import { NoteGroupEntity } from '../../entity/note-group.entity'

export class UpdateNoteGroupResponseDto extends PickType(NoteGroupEntity, ['id'] as const) {}

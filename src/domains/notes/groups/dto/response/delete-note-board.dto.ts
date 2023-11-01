import { PickType } from '@nestjs/swagger'
import { NoteGroupEntity } from '../../entity/note-group.entity'

export class DeleteNoteGroupResponseDto extends PickType(NoteGroupEntity, ['id'] as const) {}

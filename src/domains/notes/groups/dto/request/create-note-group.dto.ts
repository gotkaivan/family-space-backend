import { OmitType } from '@nestjs/swagger'
import { NoteGroupEntity } from '../../entity/note-group.entity'

export class CreateNoteGroupDto extends OmitType(NoteGroupEntity, ['id'] as const) {}

import { OmitType } from '@nestjs/swagger'
import { NoteBoardEntity } from '../../entity/note-board.entity'

export class CreateNoteBoardDto extends OmitType(NoteBoardEntity, ['id'] as const) {}

import { PickType } from '@nestjs/swagger'
import { NoteBoardEntity } from '../../entity/note-board.entity'

export class DeleteNoteBoardResponseDto extends PickType(NoteBoardEntity, ['id'] as const) {}

import { OmitType } from '@nestjs/swagger'
import { BoardEntity } from '../../entity/board.entity'

export class CreateBoardDto extends OmitType(BoardEntity, ['id'] as const) {}

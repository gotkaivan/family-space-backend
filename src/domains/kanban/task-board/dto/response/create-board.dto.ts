import { PickType } from '@nestjs/swagger'
import { BoardEntity } from '../../entity/board.entity'

export class CreateBoardResponseDto extends PickType(BoardEntity, ['id'] as const) {}

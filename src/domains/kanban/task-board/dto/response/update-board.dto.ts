import { PickType } from '@nestjs/swagger'
import { BoardEntity } from '../../entity/board.entity'

export class UpdateBoardResponseDto extends PickType(BoardEntity, ['id'] as const) {}

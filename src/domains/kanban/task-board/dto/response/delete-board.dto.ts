import { PickType } from '@nestjs/swagger'
import { BoardEntity } from '../../entity/board.entity'

export class DeleteBoardResponseDto extends PickType(BoardEntity, ['id'] as const) {}

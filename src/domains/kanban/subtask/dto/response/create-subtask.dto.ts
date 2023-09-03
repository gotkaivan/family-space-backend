import { PickType } from '@nestjs/swagger'
import { SubtaskEntity } from '../../entity/subtask.entity'

export class CreateSubtaskResponseDto extends PickType(SubtaskEntity, ['id'] as const) {}

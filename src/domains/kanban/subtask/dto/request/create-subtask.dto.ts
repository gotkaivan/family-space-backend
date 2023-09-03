import { OmitType } from '@nestjs/swagger'
import { SubtaskEntity } from '../../entity/subtask.entity'

export class CreateSubtaskDto extends OmitType(SubtaskEntity, ['id'] as const) {}

import { ApiProperty, OmitType } from '@nestjs/swagger'
import { TaskPositionEntity } from '../../entity/task-position.entity'

export class CreateTaskPositionDto extends OmitType(TaskPositionEntity, ['id'] as const) {}

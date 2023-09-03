import { OmitType } from '@nestjs/swagger'
import { TaskStatusPositionEntity } from '../../entity/task-status-position.entity'

export class CreateTaskStatusPositionDto extends OmitType(TaskStatusPositionEntity, ['id'] as const) {}

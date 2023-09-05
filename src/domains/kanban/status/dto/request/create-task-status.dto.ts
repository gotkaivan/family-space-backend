import { OmitType } from '@nestjs/swagger'
import { TaskStatusEntity } from '../../entity/task-status.entity'

export class CreateTaskStatusDto extends OmitType(TaskStatusEntity, ['id', 'tasks'] as const) {}

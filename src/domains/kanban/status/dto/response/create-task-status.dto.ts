import { PickType } from '@nestjs/swagger'
import { TaskStatusEntity } from '../../entity/task-status.entity'

export class CreateTaskStatusResponseDto extends PickType(TaskStatusEntity, ['id'] as const) {}

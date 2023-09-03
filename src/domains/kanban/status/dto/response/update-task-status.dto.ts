import { PickType } from '@nestjs/swagger'
import { TaskStatusEntity } from '../../entity/task-status.entity'

export class UpdateTaskStatusResponseDto extends PickType(TaskStatusEntity, ['id'] as const) {}

import { PickType } from '@nestjs/swagger'
import { TaskEntity } from '../../entity/task.entity'

export class DeleteTaskResponseDto extends PickType(TaskEntity, ['id'] as const) {}

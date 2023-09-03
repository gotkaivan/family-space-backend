import { PickType } from '@nestjs/swagger'
import { TaskEntity } from '../../entity/task.entity'

export class CreateTaskResponseDto extends PickType(TaskEntity, ['id'] as const) {}

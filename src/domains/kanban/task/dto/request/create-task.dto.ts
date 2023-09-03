import { OmitType } from '@nestjs/swagger'
import { TaskEntity } from '../../entity/task.entity'

export class CreateTaskDto extends OmitType(TaskEntity, ['id'] as const) {}

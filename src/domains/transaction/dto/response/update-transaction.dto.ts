import { PickType } from '@nestjs/swagger'
import { TransactionEntity } from '../../entity/transaction.entity'

export class UpdateTransactionResponseDto extends PickType(TransactionEntity, ['id'] as const) {}

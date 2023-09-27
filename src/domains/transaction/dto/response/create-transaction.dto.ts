import { PickType } from '@nestjs/swagger'
import { TransactionEntity } from '../../entity/transaction.entity'

export class CreateTransactionResponseDto extends PickType(TransactionEntity, ['id'] as const) {}

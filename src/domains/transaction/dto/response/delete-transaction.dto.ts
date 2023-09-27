import { PickType } from '@nestjs/swagger'
import { TransactionEntity } from '../../entity/transaction.entity'

export class DeleteTransactionResponseDto extends PickType(TransactionEntity, ['id'] as const) {}

import { OmitType } from '@nestjs/swagger'
import { TransactionEntity } from '../../entity/transaction.entity'

export class CreateTransactionDto extends OmitType(TransactionEntity, ['id'] as const) {}

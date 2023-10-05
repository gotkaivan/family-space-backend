import { ApiProperty } from '@nestjs/swagger'
import { TransactionDto } from '../transaction.dto'

export class GetTransactionsResponseDto {
  @ApiProperty({ description: 'Тело ответа', type: [TransactionDto] })
  readonly items: TransactionDto[]

  @ApiProperty({ description: 'Ответ пагинации' })
  readonly total: number
}

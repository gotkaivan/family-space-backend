import { ApiProperty } from '@nestjs/swagger'
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto'
import { TransactionFiltersRequestDto } from './transaction-filters-request.dto'

export class TransactionRequestOptionsDto {
  @ApiProperty({ description: 'Фильтры', type: TransactionFiltersRequestDto, required: false })
  readonly filters: TransactionFiltersRequestDto

  @ApiProperty({ description: 'Пагинация', type: PaginationRequestDto, required: false })
  readonly pagination: PaginationRequestDto
}

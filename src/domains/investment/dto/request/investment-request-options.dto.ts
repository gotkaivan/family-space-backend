import { ApiProperty } from '@nestjs/swagger'
import { PaginationRequestDto } from 'src/common/dto/pagination-request.dto'
import { InvestmentFiltersRequestDto } from './investment-filters-request.dto'

export class InvestmentRequestOptionsDto {
  @ApiProperty({ description: 'Фильтры', type: InvestmentFiltersRequestDto, required: false })
  readonly filters: InvestmentFiltersRequestDto

  @ApiProperty({ description: 'Пагинация', type: PaginationRequestDto, required: false })
  readonly pagination: PaginationRequestDto
}

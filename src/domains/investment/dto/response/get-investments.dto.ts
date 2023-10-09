import { ApiProperty } from '@nestjs/swagger'
import { InvestmentDto } from '../investment.dto'

export class GetInvestmentsResponseDto {
  @ApiProperty({ description: 'Тело ответа', type: [InvestmentDto] })
  readonly items: InvestmentDto[]

  @ApiProperty({ description: 'Ответ пагинации' })
  readonly total: number
}

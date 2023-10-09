import { PickType } from '@nestjs/swagger'
import { InvestmentDto } from '../investment.dto'

export class DeleteInvestmentResponseDto extends PickType(InvestmentDto, ['id'] as const) {}

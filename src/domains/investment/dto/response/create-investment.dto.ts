import { PickType } from '@nestjs/swagger'
import { InvestmentDto } from '../investment.dto'

export class CreateInvestmentResponseDto extends PickType(InvestmentDto, ['id'] as const) {}

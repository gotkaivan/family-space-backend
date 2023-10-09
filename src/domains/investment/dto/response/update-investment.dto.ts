import { PickType } from '@nestjs/swagger'
import { InvestmentDto } from '../investment.dto'

export class UpdateInvestmentResponseDto extends PickType(InvestmentDto, ['id'] as const) {}

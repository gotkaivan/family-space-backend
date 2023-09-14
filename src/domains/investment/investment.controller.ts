import { Controller } from '@nestjs/common'
import { InvestmentService } from './investment.service'
import { ApiTags } from '@nestjs/swagger'

@Controller('investments')
@ApiTags('Инвестирование')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}
}

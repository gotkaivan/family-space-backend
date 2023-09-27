import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { InvestmentService } from './investment.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TransactionDto } from '../transaction/dto/transaction.dto'
import { getTokenByRequest } from 'src/helpers'

@Controller('investments')
@ApiTags('Investments')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех инвестиций' })
  @ApiResponse({ status: 200, type: [TransactionDto] })
  @Get()
  public async getInvestments(@Req() request: Request): Promise<TransactionDto[]> {
    return this.investmentService.getInvestments(getTokenByRequest(request))
  }
}

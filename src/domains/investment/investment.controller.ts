import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { InvestmentService } from './investment.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { getTokenByRequest } from 'src/common/helpers'
import { GetInvestmentsResponseDto } from './dto/response/get-investments.dto'
import { InvestmentRequestOptionsDto } from './dto/request/investment-request-options.dto'
import { CreateInvestmentResponseDto } from './dto/response/create-investment.dto'
import { CreateInvestmentDto } from './dto/request/create-investment.dto'
import { InvestmentDto } from './dto/investment.dto'
import { UpdateInvestmentResponseDto } from './dto/response/update-investment.dto'
import { DeleteInvestmentResponseDto } from './dto/response/delete-investment.dto'
import { SaleInvestmentResponseDto } from './dto/response/sale-investment.dto'

@Controller('investments')
@ApiTags('Investments')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех инвестиций' })
  @ApiResponse({ status: 200, type: GetInvestmentsResponseDto })
  @Post()
  public async getInvestments(
    @Req() request: Request,
    @Body() options: InvestmentRequestOptionsDto
  ): Promise<GetInvestmentsResponseDto> {
    return this.investmentService.getInvestments(getTokenByRequest(request), options)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание инвестиции' })
  @ApiResponse({ status: 201, type: CreateInvestmentResponseDto })
  @Post('create')
  public async createInvestment(
    @Body() investment: CreateInvestmentDto,
    @Req() request: Request
  ): Promise<CreateInvestmentResponseDto> {
    return this.investmentService.createInvestment(getTokenByRequest(request), investment)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление инвестиции' })
  @ApiResponse({ status: 200, type: UpdateInvestmentResponseDto })
  @Patch()
  updateInvestment(@Body() investment: InvestmentDto, @Req() request: Request): Promise<UpdateInvestmentResponseDto> {
    return this.investmentService.updateInvestment(getTokenByRequest(request), investment)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Продажа инвестиции' })
  @ApiResponse({ status: 200, type: SaleInvestmentResponseDto })
  @Post('sale')
  saleInvestment(@Body() investment: InvestmentDto, @Req() request: Request): Promise<SaleInvestmentResponseDto> {
    return this.investmentService.saleInvestment(getTokenByRequest(request), investment)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление инвестиции' })
  @ApiResponse({ status: 200, type: DeleteInvestmentResponseDto })
  @Delete(':id')
  deleteInvestment(@Param('id') id: number, @Req() request: Request): Promise<DeleteInvestmentResponseDto> {
    return this.investmentService.deleteInvestment(getTokenByRequest(request), id)
  }
}

import { Controller, UseGuards, Body, Post, Req, Patch, Delete, Get, Param } from '@nestjs/common'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth.guard'
import { getTokenByRequest } from 'src/common/helpers'
import { TransactionService } from './transaction.service'
import { TransactionDto } from './dto/transaction.dto'
import { CreateTransactionDto } from './dto/request/create-transaction.dto'
import { CreateTransactionResponseDto } from './dto/response/create-transaction.dto'
import { UpdateTransactionResponseDto } from './dto/response/update-transaction.dto'
import { DeleteTransactionResponseDto } from './dto/response/delete-transaction.dto'
import { TransactionRequestOptionsDto } from './dto/request/transaction-request-options.dto'
import { GetTransactionsResponseDto } from './dto/response/get-transactions.dto'
import { UpdateSaleTransactionResponseDto } from './dto/response/update-sale-transaction.dto'

@Controller('transactions')
@ApiTags('Transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех транзакций' })
  @ApiResponse({ status: 200, type: GetTransactionsResponseDto })
  @Post()
  public async getTransactions(
    @Req() request: Request,
    @Body() options: TransactionRequestOptionsDto
  ): Promise<GetTransactionsResponseDto> {
    return this.transactionService.getTransactions(getTokenByRequest(request), options)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение транзакции' })
  @ApiResponse({ status: 200, type: TransactionDto })
  @Get(':id')
  public async getTransactionById(@Param('id') id: number, @Req() request: Request): Promise<TransactionDto> {
    return this.transactionService.getTransactionById(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание транзакции' })
  @ApiResponse({ status: 201, type: CreateTransactionResponseDto })
  @Post('create')
  public async createTransaction(
    @Body() transaction: CreateTransactionDto,
    @Req() request: Request
  ): Promise<CreateTransactionResponseDto> {
    return this.transactionService.createTransaction(getTokenByRequest(request), transaction)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление транзакции' })
  @ApiResponse({ status: 200, type: UpdateTransactionResponseDto })
  @Patch()
  updateTransaction(
    @Body() transaction: TransactionDto,
    @Req() request: Request
  ): Promise<UpdateTransactionResponseDto> {
    return this.transactionService.updateTransaction(getTokenByRequest(request), transaction.id, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление транзакции' })
  @ApiResponse({ status: 200, type: DeleteTransactionResponseDto })
  @Delete(':id')
  deleteTransaction(@Param('id') id: number, @Req() request: Request): Promise<DeleteTransactionResponseDto> {
    return this.transactionService.deleteTransaction(getTokenByRequest(request), id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление транзакции по продаже' })
  @ApiResponse({ status: 200, type: UpdateSaleTransactionResponseDto })
  @Post('sale/update')
  updateSaleTransaction(
    @Body() transaction: TransactionDto,
    @Req() request: Request
  ): Promise<UpdateSaleTransactionResponseDto> {
    return this.transactionService.updateSaleTransaction(getTokenByRequest(request), transaction)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление транзакции по продаже' })
  @ApiResponse({ status: 200, type: DeleteTransactionResponseDto })
  @Post(':id/sale/delete')
  deleteSaleTransaction(@Param('id') id: number, @Req() request: Request): Promise<DeleteTransactionResponseDto> {
    return this.transactionService.deleteSaleTransaction(getTokenByRequest(request), id)
  }
}

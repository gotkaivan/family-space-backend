import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { CURRENCY_TYPE } from 'src/common/types'
import { IInvestmentFilterOptions } from '../../types'
import { InvestmentFiltersDateDto } from './investment-filter-date.dto'

export class InvestmentFiltersRequestDto implements IInvestmentFilterOptions {
  @ApiProperty({ example: 'search', description: 'Поисковой запрос', required: false })
  @IsString()
  readonly search: string

  @ApiProperty({ example: 'EUR', description: 'Тип валюты', enum: CURRENCY_TYPE, required: false })
  @IsString({ message: 'Должно быть строкой' })
  readonly currencyType: CURRENCY_TYPE

  @ApiProperty({
    example: '',
    description: 'Дата совершения транзакции',
    type: InvestmentFiltersDateDto,
    required: false,
  })
  readonly transactionDate: InvestmentFiltersDateDto
}

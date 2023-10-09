import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { IInvestmentFilterDate } from '../../types'

export class InvestmentFiltersDateDto implements IInvestmentFilterDate {
  @ApiProperty({ example: '', description: 'Начальная дата' })
  @IsString()
  readonly startDate: string

  @ApiProperty({ example: '', description: 'Конечная дата' })
  @IsString()
  readonly endDate: string
}

import { IPaginationRequest } from '../types'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'

export class PaginationRequestDto implements IPaginationRequest {
  @ApiProperty({ description: 'Лимит' })
  @IsPositive()
  @IsNumber()
  readonly limit: number

  @ApiProperty({ description: 'Номер страницы' })
  @IsPositive()
  @IsNumber()
  readonly page: number
}

import { Module } from '@nestjs/common'
import { InvestmentService } from './investment.service'
import { InvestmentController } from './investment.controller'
import { TransactionModel } from '../transaction/models/transaction.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { UsersService } from '../users/users.service'
import { UserModel } from '../users/user.model'

@Module({
  controllers: [InvestmentController],
  imports: [SequelizeModule.forFeature([TransactionModel, UserModel])],
  providers: [InvestmentService, UsersService],
})
export class InvestmentModule {}

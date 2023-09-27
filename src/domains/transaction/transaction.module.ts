import { Module } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { TransactionController } from './transaction.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { TransactionModel } from './models/transaction.model'
import { TransactionUserModel } from './models/transaction-user.model'
import { UsersService } from '../users/users.service'
import { UserModel } from '../users/user.model'

@Module({
  controllers: [TransactionController],
  imports: [SequelizeModule.forFeature([TransactionModel, TransactionUserModel, UserModel])],
  providers: [TransactionService, UsersService],
})
export class TransactionModule {}

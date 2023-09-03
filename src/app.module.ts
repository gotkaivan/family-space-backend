import { UserModel } from './domains/users/user.model'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from './domains/auth/auth.module'
import { UsersModule } from './domains/users/users.module'
import { TransactionModule } from './domains/transaction/transaction.module'
import { InvestmentModule } from './domains/investment/investment.module'
import { TaskModule } from './domains/kanban/kanban.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '43081',
      database: 'family',
      models: [UserModel],
      autoLoadModels: true,
      sync: { force: false },
    }),
    AuthModule,
    UsersModule,
    TransactionModule,
    InvestmentModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

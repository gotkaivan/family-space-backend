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
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [UserModel],
      autoLoadModels: true,
      sync: { force: true },
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

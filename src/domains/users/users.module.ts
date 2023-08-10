import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from 'src/domains/auth/auth.module'
import { UserModel } from './user.model'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([UserModel]), forwardRef(() => AuthModule)],
  exports: [UsersService],
})
export class UsersModule {}

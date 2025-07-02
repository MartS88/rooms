// users.module

// Module
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { User } from './models/user-model';
import { RefreshToken } from '../auth/models/refresh-token-model';

// Services
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User,RefreshToken]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
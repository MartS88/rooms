// auth.module.ts

// Nest js
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

// Modules
import { UsersModule } from '../users/users.module';

// Services and controllers
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// Models
import { User } from '../users/models/user-model';
import { RefreshToken } from './models/refresh-token-model';
import { Booking } from '../booking/models/booking-model';
import { Room } from '../booking/models/room-model';

// Config
import jwtConfig from './config/jwt.config';
import refreshJwtConfig from './config/refresh-jwt.config';
import googleAuthConfig from './config/google-oauth.config';

// Guard and strategies
import { APP_GUARD } from '@nestjs/core';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RolesGuard } from './guards/roles/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';



@Module({
  imports: [
    SequelizeModule.forFeature([User,RefreshToken,Booking,Room]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleAuthConfig),
    UsersModule,

  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    GoogleStrategy,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
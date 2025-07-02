// app.module

// Other packages
import * as process from 'process';

// Nest js
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';

// Winston
import { WinstonModule } from 'nest-winston';

// Config
import { createWinstonConfig } from './common/config/winston.config';
import { SequelizeConfig } from './common/config/sequelize.config';

// Env
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      expandVariables: true,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createWinstonConfig,
    }), // Winston logs config
    SequelizeModule.forRootAsync(SequelizeConfig), // Sequelize ORM
    UsersModule,
    AuthModule,
    BookingModule,
  ],
  providers: [
    Logger,
  ],
  controllers: [],
})
export class AppModule {
}


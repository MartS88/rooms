// src/common/config/sequelize.config.ts

// Nest js
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

// Models
import { User } from '../../users/models/user-model';
import { RefreshToken } from '../../auth/models/refresh-token-model';
import {Booking} from "../../booking/models/booking-model";
import {Room} from "../../booking/models/room-model";


export const SequelizeConfig = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<SequelizeModuleOptions> => {
    return {
      dialect: 'mysql',
      host: configService.get<string>('MYSQL_HOST'),
      port: configService.get<number>('MYSQL_PORT'),
      username: configService.get<string>('MYSQL_USERNAME'),
      password: configService.get<string>('MYSQL_PASSWORD'),
      database: configService.get<string>('MYSQL_NAME'),
      models: [User, RefreshToken, Room, Booking],
      dialectOptions: {
        // ssl: {
        //   require: true,
        //   rejectUnauthorized: false,
        // },
      },
      pool: {
        max: 50,
        min: 10,
        acquire: 10000,
        idle: 5000,
      },
    };
  },
  inject: [ConfigService],
};

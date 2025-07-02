// jwt.config.ts

// Nest js
import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

// ENV
import * as dotenv from 'dotenv';
const envFile = `./.${process.env.NODE_ENV || 'development'}.env`;
dotenv.config({ path: envFile });

console.log('process.env.JWT_ACCESS_SECRET',process.env.JWT_ACCESS_SECRET);

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    },
  }),
);

// refresh-jwt.config.ts

// Nest js
import { registerAs } from '@nestjs/config';
import {  JwtSignOptions } from '@nestjs/jwt';

// ENV
import * as dotenv from 'dotenv';
const envFile = `./.${process.env.NODE_ENV || 'development'}.env`;
dotenv.config({ path: envFile });

console.log('JWT_REFRESH_SECRET',process.env.JWT_REFRESH_SECRET);

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  }),
);

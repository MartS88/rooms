// refresh.strategy.ts

// Nest js
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';

// Config
import refreshJwtConfig from '../config/refresh-jwt.config';

// Service
import { AuthService } from '../auth.service';


@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,
  ) {
    super({

      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          //console.log('cookies in strategy:', request.cookies);
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: refreshJwtConfiguration.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AuthJwtPayload) {
    const refreshToken = req.cookies?.refreshToken;
    const userId = payload.sub;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}


// google.strategy.ts

// Nest js
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Request } from 'express';

// Config
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';

// Services
import { AuthService } from '../auth.service';
import { GoogleAuthMode } from '../types/google-oath';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }


  async validate(req: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {

    let mode = req.query.state as string;

    console.log('validate',mode);

    if (mode !== GoogleAuthMode.SIGNUP && mode !== GoogleAuthMode.LOGIN) {
      throw new BadRequestException('Invalid mode');
    }

    try {
      const googleUser = {
        email: profile.emails[0].value,
        password: '',
        username: profile?.displayName,
        avatarUrl: profile.photos?.[0]?.value,
      };

      const user = await this.authService.validateGoogleUser({ googleUser, mode });
      console.log('user validate',user);
      done(null, user);

    } catch (error) {
      if (error instanceof ConflictException) {
        console.log('error instanceof ConflictException',error);
        return done(null, false, { message: error.message });
      }

      if (error instanceof NotFoundException) {
        console.log('error instanceof NotFoundException',error);
        return done(null, false, { message: error.message });
      }
      done(error, false);
    }
  }
}
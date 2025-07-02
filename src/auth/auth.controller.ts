// src/auth/auth.controller.ts

// Nest js
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

// Decorators
import { Public } from './decorators/public.decorator';
import { ClientMeta } from './decorators/client-meta.decorator';
import { UserId } from '../common/decorators';

// Guards
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

// Services
import { AuthService } from './auth.service';

// Dto
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ClientMetaDto } from './dto/client-meta.dto';

// Routes
import { AUTH } from './auth.routes';

@Controller(AUTH.CONTROLLER)
export class AuthController {
	private readonly COOKIE_MAX_AGE: number;

	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {
		this.COOKIE_MAX_AGE = Number(this.configService.get('COOKIE_MAX_AGE'));
	}

	@Public()
	@Post(AUTH.ROUTES.REGISTER)
	async register(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response, @ClientMeta() meta: ClientMetaDto) {
		const { ipAddress, userAgent } = meta;

		const user = await this.authService.register(dto);
		const { accessToken, refreshToken, id } = await this.authService.login(user.id, ipAddress, userAgent);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			path: '/',
			maxAge: this.COOKIE_MAX_AGE
		});


		return { id, accessToken };
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post(AUTH.ROUTES.LOGIN)
	async login(@UserId() userId: number, @Res({ passthrough: true }) res: Response, @ClientMeta() meta: ClientMetaDto) {
		const { ipAddress, userAgent } = meta;

		const { accessToken, refreshToken, id } = await this.authService.login(userId, ipAddress, userAgent);
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			path: '/',
			maxAge: this.COOKIE_MAX_AGE
		});

		return { id, accessToken };
	}


	@UseGuards(RefreshAuthGuard)
	@Post(AUTH.ROUTES.REFRESH)
	async refreshToken(@UserId() userId: number, @Res({ passthrough: true }) res: Response, @ClientMeta() meta: ClientMetaDto) {
		const { ipAddress, userAgent } = meta;
		const { accessToken, refreshToken, id } = await this.authService.refreshToken(userId, ipAddress, userAgent);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			path: '/',
			maxAge: this.COOKIE_MAX_AGE
		});

		return { id, accessToken };

	}

	@UseGuards(JwtAuthGuard)
	@Post(AUTH.ROUTES.LOGOUT)
	async logOut(@UserId() userId: number, @Res({ passthrough: true }) res: Response, @ClientMeta() meta: ClientMetaDto) {
		try {
			const { ipAddress, userAgent } = meta;

			await this.authService.logOut(userId, ipAddress, userAgent);
			res.clearCookie('refreshToken', {
				httpOnly: true,
				secure: true,
				sameSite: 'none',
				path: '/'

			});

			return { message: 'Logged out successfully' };

		} catch (error: any) {
			throw new Error(error.message);
		}
	}


	@Public()
	@UseGuards(GoogleAuthGuard)
	@Get(AUTH.ROUTES.GOOGLE_LOGIN)
	loginGoogle(@Query('mode') mode: string) {
	}

	@Public()
	@UseGuards(GoogleAuthGuard)
	@Get(AUTH.ROUTES.GOOGLE_CALLBACK)
	async googleCallback(@Req() req, @Res() res, @ClientMeta() meta: ClientMetaDto) {
		try {
			const { ipAddress, userAgent } = meta;

			const FRONTEND_ORIGIN = this.configService.get<string>('FRONTEND_ORIGIN');

			if (!FRONTEND_ORIGIN) {
				throw new Error('FRONTEND_URL is not set');
			}

			if (!req.user && req.authInfo?.message) {
				const errorMsg = req.authInfo.message;

				const errorCodeMap = [
					{ text: 'already exists', mode: 'signup', code: 409 },
					{ text: 'not found', mode: 'login', code: 404 }
				];

				for (const err of errorCodeMap) {
					if (errorMsg.toLowerCase().includes(err.text)) {
						return res.redirect(`${FRONTEND_ORIGIN}/authorize?mode=${err.mode}&error=${err.code}`);
					}
				}

				if (!req.user?.id) {
					return res.redirect(`${FRONTEND_ORIGIN}/authorize?error=user_null`);
				}

				return res.redirect(`${FRONTEND_ORIGIN}/authorize?error=unknown`);
			}

			console.log('User passed to Google callback:', req.user);

			const { accessToken, refreshToken, id } = await this.authService.login(req.user.id, ipAddress, userAgent);

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'none',
				path: '/',
				maxAge: this.COOKIE_MAX_AGE
			});

			return res.redirect(`${FRONTEND_ORIGIN}/authorize?token=${accessToken}&id=${id}`);

		} catch (error) {
			console.error('Error during Google callback:', error);
			res.status(500).send({ message: error.message });
		}
	}



}

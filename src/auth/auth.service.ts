// auth.service.ts

// Other packages
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';

// Nest js
import {
	BadRequestException,
	ConflictException,
	GoneException,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService, ConfigType } from '@nestjs/config';

// Config
import refreshJwtConfig from './config/refresh-jwt.config';

// Dto
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

// Types
import { CurrentUser } from './types/current-user';
import { AuthJwtPayload } from './types/auth-jwtPayload';

// Models
import { User } from '../users/models/user-model';
import { RefreshToken } from './models/refresh-token-model';

// Services
import { UsersService } from '../users/users.service';

// Types
import { GoogleAuthMode, ValidateGoogleUserOptions } from './types/google-oath';
import { Sequelize } from 'sequelize-typescript';


@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly configService: ConfigService,
		private userService: UsersService,
		private jwtService: JwtService,
		@Inject(refreshJwtConfig.KEY)
		private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
		@Inject(Sequelize) private readonly sequelize: Sequelize,
		@InjectModel(User) private userRepository: typeof User,
		@InjectModel(RefreshToken) private refreshTokenRepository: typeof RefreshToken,

	) {
	}

	async validateUser(email: string, password: string) {
		const user = await this.userService.getUserByEmail(email);
		if (!user) throw new UnauthorizedException('User with this email does not exist');
		const isPasswordMatch = await argon2.verify(user.password, password);

		if (!isPasswordMatch)
			throw new UnauthorizedException('Password does not match');
		return {id: user.id};
	}

	async register(userDto: CreateUserDto) {
		const {email} = userDto;

		const existingUser = await this.userService.getUserByEmail(email);
		if (existingUser) {
			throw new ConflictException('User with this email already exist');
		}

		const newUser = await this.userService.createUser(userDto);
		return newUser;

	}

	async login(userId: number, ipAddress: string, userAgent: string) {
		const {accessToken, refreshToken} = await this.generateTokens(userId);
		const hashedRefreshToken = await argon2.hash(refreshToken);

		await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken, ipAddress, userAgent);
		return {
			id: userId,
			accessToken,
			refreshToken
		};
	}

	async generateTokens(userId: number) {
		const payload: AuthJwtPayload = {sub: userId};
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload),
			this.jwtService.signAsync(payload, this.refreshTokenConfig)
		]);
		return {
			accessToken,
			refreshToken
		};
	}

	async refreshToken(userId: number, ipAddress: string, userAgent: string) {
		const {accessToken, refreshToken} = await this.generateTokens(userId);
		const hashedRefreshToken = await argon2.hash(refreshToken);

		await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken, ipAddress, userAgent);
		return {
			id: userId,
			accessToken,
			refreshToken
		};
	}

	async validateRefreshToken(userId: number, refreshToken: string) {
		const user = await this.userService.getUserById(userId);
		const refreshTokenEntity = await this.userService.getRefreshEntity(userId);

		if (!refreshTokenEntity) {
			throw new NotFoundException(`Refresh token with user_id:${userId} not found`);
		}

		const {hashedRefreshToken} = refreshTokenEntity;

		if (!user || !refreshTokenEntity) {
			throw new UnauthorizedException('Invalid Refresh Token');
		}

		const refreshTokenMatches = await argon2.verify(
			hashedRefreshToken,
			refreshToken
		);

		if (!refreshTokenMatches) {
			this.logger.error('validateRefreshToken', 'Invalid Refresh Token');
			throw new UnauthorizedException('Invalid Refresh Token');
		}
		return {id: userId};
	}

	async logOut(userId: number, ipAddress: string, userAgent: string) {
		await this.userService.updateHashedRefreshToken(userId, null, ipAddress, userAgent);
	}

	async validateJwtUser(userId: number) {
		const user = await this.userService.getUserById(userId);
		if (!user) throw new UnauthorizedException('User not found!');

		const currentUser: CurrentUser = {id: user.id, role: user.role};
		return currentUser;
	}

	async validateGoogleUser({googleUser, mode}: ValidateGoogleUserOptions) {
		const {email} = googleUser;
		const user = await this.userService.getUserByEmail(email);

		if (mode === GoogleAuthMode.LOGIN) {
			if (user) return user;
			throw new NotFoundException('An account with this email address was not found.');
		} else if (mode === GoogleAuthMode.SIGNUP) {
			if (user) {
				throw new ConflictException('User with this email already exists!');
			}

			const newUser = await this.userService.createUser(googleUser);

			if (!newUser?.id) {
				await newUser.reload();
			}

			return newUser;
		}
	}


	checkPasswordRequirements(password: string) {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?#]).{8,20}$/;
		if (!passwordRegex.test(password)) {
			throw new UnauthorizedException(
				'Password must be 8-20 characters, include one uppercase letter, one number, and one special character.'
			);
		}
	}


}
// users.service.ts

// Nestjs
import {InjectModel} from '@nestjs/sequelize';

import {
    Injectable,
} from '@nestjs/common';

// Models
import {User} from './models/user-model';
import {RefreshToken} from '../auth/models/refresh-token-model';

// Dto
import {CreateUserDto} from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(RefreshToken) private refreshTokenRepository: typeof RefreshToken,
    ) {
    }

    async createUser(dto: CreateUserDto) {
        return this.userRepository.create(dto);
    }

    async getUserById(id: number) {
        return this.userRepository.findByPk(id, {
            attributes: {
                exclude: ['password'],
            },
        });
    }

    async getUserByEmail(email: string) {
        return this.userRepository.findOne({
            where: {email},
            attributes: {exclude: ['created_at', 'updated_at']},

        });
    }

    async getRefreshEntity(userId: number) {
        return this.refreshTokenRepository.findOne({where: {userId}, include: {all: true}});
    }


    /**
     * Updates or creates a refresh token entry for a specific user session.
     *
     * This function first attempts to find an existing refresh token record
     * for the given combination of `userId`, `ipAddress`, and `userAgent`.
     *
     * - If a matching record is found, it updates the `hashedRefreshToken`.
     * - If no record is found and `hashedRefreshToken` is not null, it creates a new record.
     * - If no record is found and `hashedRefreshToken` is null, it does nothing (no invalid token is created).
     *
     * @param {number} userId - The ID of the user whose session is being updated.
     * @param {string | null} hashedRefreshToken - The new hashed refresh token to store, or null to invalidate the session.
     * @param {string} ipAddress - The IP address associated with the session.
     * @param {string} userAgent - The user agent string of the client device.
     *
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    async updateHashedRefreshToken(userId: number, hashedRefreshToken: string, ipAddress: string, userAgent: string) {
        const existingToken = await this.refreshTokenRepository.findOne({where: {userId, ipAddress, userAgent}});

        if (existingToken) {
            await existingToken.update({hashedRefreshToken});
        } else if (hashedRefreshToken !== null) {
            await this.refreshTokenRepository.create({
                userId,
                hashedRefreshToken,
                ipAddress,
                userAgent,
            });
        }
    }


    async getUserByUsername(username: string) {
        return this.userRepository.findOne({
            where: {username},
            include: {all: true},
        });
    }


}

// src/booking/booking.service

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

// Models
import { Booking } from './models/booking-model';
import { Room } from './models/room-model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Op } from 'sequelize';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking) private bookingRepository: typeof Booking,
    @InjectModel(Room) private roomRepository: typeof Room,
  ) {
  }

  async getAllRooms(): Promise<Room[]> {
    return this.roomRepository.findAll();
  }

  async getBookingByUserId(userId: number): Promise<Booking[]> {
    return this.bookingRepository.findAll({
      where: { userId },
      include: [
        {
          model: Room,
          required: true,
        },
      ],
    });
  }

  async getBookById(id:number): Promise<Booking> {
    return this.bookingRepository.findByPk(id)
  }

  async createBooking(userId: number, dto: CreateBookingDto) {
    const { roomId, startUnix, endUnix } = dto;

    if (startUnix >= endUnix) {
      throw new BadRequestException('Start time must be before end time');
    }

    const isConflict = await this.bookingRepository.findOne({
      where: {
        roomId,
        [Op.not]: {
          [Op.or]: [
            { startUnix: { [Op.gte]: endUnix } },
            { endUnix: { [Op.lte]: startUnix } },
          ],
        },
      },
    });

    if (isConflict) {
      throw new ConflictException('Room is already booked during this time');
    }

    await this.bookingRepository.create({
      userId,
      roomId,
      startUnix,
      endUnix,
    })
    return {message:'You booked room'}
  }


  async deleteBooking(userId: number, bookingId: number) {
    const booking = await this.bookingRepository.findByPk(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this booking');
    }

    await booking.destroy();
    return { message: 'Booking deleted successfully' };
  }


  async getAllBookings(): Promise<Booking[]> {
    return this.bookingRepository.findAll({
      include: [
        {
          model: Room,
          required: true,
        },
      ],
    });
  }
}

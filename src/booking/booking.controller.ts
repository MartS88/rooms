// src/booking/booking.controller.ts

// Nestjs
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';

// Services
import { BookingService } from './booking.service';

// Decorators
import { UserId } from '../common/decorators';

// Routes
import { BOOKING } from './booking.routes';

// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// Dto
import { CreateBookingDto } from './dto/create-booking.dto';

// Type
import { ROLE } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller(BOOKING.CONTROLLER)
export class BookingController {

  constructor(private readonly bookingService: BookingService) {
  }

  @Get(BOOKING.ROUTES.USER.GET_ALL_ROOMS)
  async getAllRooms() {
    return await this.bookingService.getAllRooms();
  }

  @Get(BOOKING.ROUTES.USER.GET_ALL_BOOKINGS)
  async getAllBookings(@UserId() userId: number) {
    return await this.bookingService.getBookingByUserId(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN)
  @Get(BOOKING.ROUTES.ADMIN.GET_ALL_BOOKINGS)
  async getAllUsersBookings() {
    return await this.bookingService.getAllBookings();
  }

  @Post(BOOKING.ROUTES.USER.CREATE_BOOKING)
  async createBooking(@UserId() userId: number, @Body() dto: CreateBookingDto) {
    return await this.bookingService.createBooking(userId, dto);
  }

  @Delete(BOOKING.ROUTES.USER.DELETE_BOOKING)
  async deleteBooking(@UserId() userId: number,@Param('id') id: number) {
    return await this.bookingService.deleteBooking(userId, id);
  }

}

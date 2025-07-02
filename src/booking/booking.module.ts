// src/booking/booking.module

// Module
import {Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';

// Services and Controller
import {BookingController} from "./booking.controller";
import {BookingService} from "./booking.service";

// Models
import {Booking} from "./models/booking-model";
import {Room} from "./models/room-model";

@Module({
    imports: [
        SequelizeModule.forFeature([Booking, Room]),
    ],
    controllers: [BookingController],
    providers: [BookingService],
    exports: [BookingService],
})
export class BookingModule {
}
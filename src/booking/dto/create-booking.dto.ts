// src/booking/create-booking.dto.ts

import {IsInt, IsNotEmpty, Min} from 'class-validator';

export class CreateBookingDto {
    @IsInt()
    @IsNotEmpty()
    roomId: number;

    @IsInt()
    @Min(0)
    startUnix: number;

    @IsInt()
    @Min(0)
    endUnix: number;
}

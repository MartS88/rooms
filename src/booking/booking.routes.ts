// src/booking/booking.routes.ts

export const BOOKING = {
    CONTROLLER: 'booking',
    ROUTES: {
        USER: {
            GET_ALL_ROOMS: 'all-rooms',
            GET_ALL_BOOKINGS: 'all-bookings',
            CREATE_BOOKING: '',
            UPDATE_BOOKING: ':id',
            DELETE_BOOKING: ':id',
        },
        ADMIN: {
            ADD_ROOM: 'admin/room',
            DELETE_ROOM: 'admin/room/:id',
            GET_ALL_BOOKINGS: 'admin/all-bookings',
        },
    },
} as const;

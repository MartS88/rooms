// src/booking/rooms-model.ts

// Sequelize
import {
    Column,
    DataType, HasMany,
    Model,
    Table,

} from 'sequelize-typescript';

// Models
import {Booking} from "./booking-model";


@Table({
    tableName: 'rooms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class Room extends Model<Room> {
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    capacity: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    location: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    hasProjector: boolean;

    @HasMany(() => Booking)
    bookings: Booking[];

}

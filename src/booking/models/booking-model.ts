// src/booking/booking-model.ts

// Sequelize
import {
    Column,
    DataType,
    Model,
    Table,
  BelongsTo, ForeignKey,
} from 'sequelize-typescript';

// Models
import {User} from "../../users/models/user-model";
import {Room} from "./room-model";

@Table({
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class Booking extends Model<Booking> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        comment: 'Unix timestamp in milliseconds',
        field: 'start_unix',
    })
    startUnix: number;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        comment: 'Unix timestamp in milliseconds',
        field: 'end_unix',
    })
    endUnix: number;

    @ForeignKey(() => Room)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'room_id',
    })
    roomId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'user_id',
    })
    userId: number;

    @BelongsTo(() => Room)
    room: Room;

    @BelongsTo(() => User)
    user: User;
}
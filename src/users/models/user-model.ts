// user-model.ts

// Sequelize
import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  BeforeUpdate,
  BeforeCreate, HasOne,
} from 'sequelize-typescript';

// Enum
import { ROLE } from '../../auth/enums/role.enum';

// Models
import { RefreshToken } from '../../auth/models/refresh-token-model';

// Argon
import * as argon2 from 'argon2';

// Models
import {Booking} from "../../booking/models/booking-model";


interface UserCreationAttrs {
  username: string;
  email: string;
  password: string;
}

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class User extends Model<User, UserCreationAttrs> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({
    type: DataType.STRING(20),
    unique: true,
    allowNull: true,
    defaultValue: null,
  })
  username: string;


  @Column({ type: DataType.STRING(320), unique: true, allowNull: false })
  email: string;


  @Column({ type: DataType.STRING(100), allowNull: false })
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(ROLE)),
    allowNull: false,
    defaultValue: ROLE.USER,
  })
  role: ROLE;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
    field: 'avatar_url',
  })
  avatarUrl: string;


  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_activated',
  })
  isActivated: boolean;

  @HasMany(() => RefreshToken, { onDelete: 'CASCADE', hooks: true })
  refreshTokens: RefreshToken[];

  @HasMany(() => RefreshToken, { onDelete: 'CASCADE', hooks: true })
  bookings: Booking[];

  // Automatic password hashing
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      instance.password = await argon2.hash(instance.password, {
        type: argon2.argon2id,
      });
    }
  }
}
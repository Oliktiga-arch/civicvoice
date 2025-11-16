import mongoose, { Document, Schema } from 'mongoose';

/**
 * User roles for role-based access control
 */
export type UserRole = 'citizen' | 'mediator' | 'admin';

/**
 * User interface extending Mongoose Document
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User schema definition
 */
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['citizen', 'mediator', 'admin'],
      default: 'citizen',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for email lookups
userSchema.index({ email: 1 });

/**
 * User model
 */
const User = mongoose.model<IUser>('User', userSchema);

export default User;
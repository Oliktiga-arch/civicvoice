import mongoose, { Schema } from 'mongoose';

/**
 * User schema definition
 */
const userSchema = new Schema(
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
const User = mongoose.model('User', userSchema);

export default User;
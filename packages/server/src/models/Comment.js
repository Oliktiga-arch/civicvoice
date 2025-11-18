import mongoose, { Schema } from 'mongoose';

/**
 * Comment schema definition
 */
const commentSchema = new Schema(
  {
    report: {
      type: Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isMediator: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries by report
commentSchema.index({ report: 1, createdAt: -1 });

/**
 * Comment model
 */
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
import mongoose, { Document, Schema } from 'mongoose';

/**
 * Comment interface extending Mongoose Document
 */
export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  report: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  body: string;
  isMediator: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Comment schema definition
 */
const commentSchema = new Schema<IComment>(
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
const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
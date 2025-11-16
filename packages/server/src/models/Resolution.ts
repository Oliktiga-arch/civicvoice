import mongoose, { Document, Schema } from 'mongoose';

/**
 * Resolution outcome enumeration
 */
export type ResolutionOutcome = 'resolved' | 'dismissed' | 'escalated' | 'pending';

/**
 * Resolution interface extending Mongoose Document
 */
export interface IResolution extends Document {
  _id: mongoose.Types.ObjectId;
  report: mongoose.Types.ObjectId;
  mediator: mongoose.Types.ObjectId;
  outcome: ResolutionOutcome;
  publicSummary: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Resolution schema definition
 */
const resolutionSchema = new Schema<IResolution>(
  {
    report: {
      type: Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
      unique: true, // One resolution per report
    },
    mediator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    outcome: {
      type: String,
      enum: ['resolved', 'dismissed', 'escalated', 'pending'],
      required: true,
    },
    publicSummary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
resolutionSchema.index({ report: 1 });
resolutionSchema.index({ mediator: 1, createdAt: -1 });

/**
 * Resolution model
 */
const Resolution = mongoose.model<IResolution>('Resolution', resolutionSchema);

export default Resolution;
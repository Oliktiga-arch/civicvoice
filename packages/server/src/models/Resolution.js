import mongoose, { Schema } from 'mongoose';

/**
 * Resolution schema definition
 */
const resolutionSchema = new Schema(
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
const Resolution = mongoose.model('Resolution', resolutionSchema);

export default Resolution;
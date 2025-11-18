import mongoose, { Schema } from 'mongoose';

/**
 * Report schema definition
 */
const reportSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coords) {
            return coords && coords.length === 2 &&
                   coords[0] >= -180 && coords[0] <= 180 &&
                   coords[1] >= -90 && coords[1] <= 90;
          },
          message: 'Invalid coordinates',
        },
      },
    },
    image: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'resolved', 'closed'],
      default: 'pending',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geospatial queries
reportSchema.index({ location: '2dsphere' });

// Compound index for efficient queries
reportSchema.index({ status: 1, createdAt: -1 });

/**
 * Report model
 */
const Report = mongoose.model('Report', reportSchema);

export default Report;
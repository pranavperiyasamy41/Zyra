import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    // This is the most important field!
    // It links this medicine batch to a specific user.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This tells Mongoose to reference the 'User' model
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    batchId: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    mrp: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// This ensures a user cannot have two batches with the same batchId
medicineSchema.index({ user: 1, batchId: 1 }, { unique: true });

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
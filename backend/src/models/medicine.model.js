import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // 🔫 BARCODE FIELD (New)
    barcode: {
      type: String,
      trim: true,
      default: '' // Optional, because not all medicines have barcodes
    },
    batchId: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
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
    category: {
        type: String,
        default: 'General'
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate Batch IDs for the same user
medicineSchema.index({ user: 1, batchId: 1 }, { unique: true });

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
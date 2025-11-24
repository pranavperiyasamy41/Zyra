import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true,
  },
  medicineName: { // <-- We are saving the name as a string here
    type: String, 
    required: true,
  },
  quantitySold: {
    type: Number,
    required: true,
  },
  pricePerUnit: { // The price it was sold at
    type: Number,
    required: true,
  },
});

const saleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemsSold: [saleItemSchema], // An array of items in this one sale
    totalAmount: {
      type: Number,
      required: true,
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    customerName: {
      type: String,
      default: 'N/A',
    },
    customerPhone: {
      type: String,
    },
    customerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
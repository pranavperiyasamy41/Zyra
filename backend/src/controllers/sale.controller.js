import Sale from '../models/sale.model.js';
import Medicine from '../models/medicine.model.js';
import mongoose from 'mongoose';

// @desc    Record a new sale
// @route   POST /api/sales
// @access  Private
export const recordSale = async (req, res) => {
  const { itemsSold, totalAmount } = req.body;

  // 1. Basic Validation
  if (!itemsSold || itemsSold.length === 0 || !totalAmount) {
    return res.status(400).json({ message: 'Missing sale data' });
  }

  // 2. Start a database session for a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Create the sale record
    const sale = new Sale({
      user: req.user.id,
      itemsSold,
      totalAmount,
    });
    const createdSale = await sale.save({ session });

    // 4. Update the medicine stock for each item sold
    for (const item of itemsSold) {
      const medicine = await Medicine.findById(item.medicine).session(session);

      if (!medicine) {
        throw new Error(`Medicine with ID ${item.medicine} not found`);
      }
      
      // Security check: Make sure the medicine belongs to the user
      if (medicine.user.toString() !== req.user.id) {
          throw new Error('Not authorized to sell this medicine');
      }

      if (medicine.quantity < item.quantitySold) {
        throw new Error(`Not enough stock for ${medicine.name}`);
      }

      medicine.quantity -= item.quantitySold;
      await medicine.save({ session });
    }

    // 5. If all is good, commit the transaction
    await session.commitTransaction();
    res.status(201).json(createdSale);

  } catch (error) {
    // 6. If anything fails, abort the transaction
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    // 7. Always end the session
    session.endSession();
  }
};

// @desc    Get sales history for the user
// @route   GET /api/sales
// @access  Private
export const getSalesHistory = async (req, res) => {
  try {
    const sales = await Sale.find({ user: req.user.id }).sort({ saleDate: -1 });
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
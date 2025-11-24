import Sale from '../models/sale.model.js';
import Medicine from '../models/medicine.model.js';
import mongoose from 'mongoose';

// @desc    Record a new sale
// @route   POST /api/sales
// @access  Private
export const recordSale = async (req, res) => {
  const { itemsSold, totalAmount, customerName, customerPhone, customerId } = req.body;

  // 1. Core Validation Check
  if (!itemsSold || itemsSold.length === 0 || !totalAmount || !customerId) {
    return res.status(400).json({ message: 'Missing required sale data' });
  }

  // --- NEW VALIDATION ---
  const numericCustomerId = Number(customerId);
  
  if (isNaN(numericCustomerId) || numericCustomerId < 100 || numericCustomerId > 10000) {
      return res.status(400).json({ message: 'Customer ID must be a number between 100 and 10000.' });
  }

  // Check for uniqueness
  const existingSale = await Sale.findOne({ customerId });
  if (existingSale) {
      return res.status(409).json({ message: `Customer ID ${customerId} already exists.` });
  }
  // --- END NEW VALIDATION ---

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Create the sale record
    const sale = new Sale({
      user: req.user.id,
      itemsSold,
      totalAmount,
      customerName,
      customerPhone,
      customerId,
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
    // 6. Abort
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    // 7. End session
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

// @desc    Delete a sale record
// @route   DELETE /api/sales/:id
// @access  Private
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, user: req.user.id });

    if (!sale) {
      return res.status(404).json({ message: 'Sale record not found' });
    }

    // WARNING: This only deletes the record. It DOES NOT restore inventory stock.
    // Full stock reversal requires detailed transaction logging.
    await Sale.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Sale record deleted. Stock must be manually corrected.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update sale metadata (Name, Phone, ID)
// @route   PUT /api/sales/:id
// @access  Private
export const updateSale = async (req, res) => {
  try {
    const { customerName, customerPhone, customerId } = req.body;

    const sale = await Sale.findOne({ _id: req.params.id, user: req.user.id });

    if (!sale) {
      return res.status(404).json({ message: 'Sale record not found' });
    }

    // Only allow updating customer metadata, not itemsSold or totalAmount
    sale.customerName = customerName || sale.customerName;
    sale.customerPhone = customerPhone || sale.customerPhone;
    
    // Validate and update customerId if present
    if (customerId) {
        const numericCustomerId = Number(customerId);
        if (isNaN(numericCustomerId) || numericCustomerId < 100 || numericCustomerId > 10000) {
            return res.status(400).json({ message: 'Customer ID must be a number between 100 and 10000.' });
        }
        // Check uniqueness against other sales records
        const existingSale = await Sale.findOne({ customerId, _id: { $ne: req.params.id } });
        if (existingSale) {
            return res.status(409).json({ message: `Customer ID ${customerId} already exists.` });
        }
        sale.customerId = customerId;
    }


    await sale.save();
    res.status(200).json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
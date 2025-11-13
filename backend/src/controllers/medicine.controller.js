import Medicine from '../models/medicine.model.js';

// @desc    Add a new medicine batch
// @route   POST /api/medicines
// @access  Private
export const addMedicine = async (req, res) => {
  try {
    // 1. Get all the data from the request body
    const { name, batchId, quantity, mrp, expiryDate } = req.body;

    // 2. Basic validation
    if (!name || !batchId || !quantity || !mrp || !expiryDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 3. Create a new medicine document
    const medicine = new Medicine({
      name,
      batchId,
      quantity,
      mrp,
      expiryDate,
      user: req.user.id, // <-- This is the crucial link to the logged-in user
    });

    // 4. Save it to the database
    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);

  } catch (error) {
    // Check for our 'unique' index error
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Error: A medicine with this Batch ID already exists.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all medicines for the logged-in user
// @route   GET /api/medicines
// @access  Private
export const getMedicines = async (req, res) => {
  try {
    // 1. Find all medicines that belong to this user
    const medicines = await Medicine.find({ user: req.user.id })
                                    .sort({ expiryDate: 1 }); // Sort by expiry date, soonest first

    // 2. Send them back
    res.status(200).json(medicines);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    // 1. Get the new data from the body
    const { name, batchId, quantity, mrp, expiryDate, lowStockThreshold } = req.body;
    
    // 2. Find the medicine by its ID
    const medicine = await Medicine.findById(req.params.id);

    // 3. Check if the medicine exists
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // 4. CRITICAL: Check if this medicine belongs to the logged-in user
    if (medicine.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 5. Update the fields
    medicine.name = name || medicine.name;
    medicine.batchId = batchId || medicine.batchId;
    medicine.quantity = quantity !== undefined ? quantity : medicine.quantity;
    medicine.mrp = mrp || medicine.mrp;
    medicine.expiryDate = expiryDate || medicine.expiryDate;
    medicine.lowStockThreshold = lowStockThreshold || medicine.lowStockThreshold;

    // 6. Save the updated document
    const updatedMedicine = await medicine.save();
    res.status(200).json(updatedMedicine);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a medicine batch
// @route   DELETE /api/medicines/:id
// @access  Private
export const deleteMedicine = async (req, res) => {
  try {
    // 1. Find the medicine by its ID
    const medicine = await Medicine.findById(req.params.id);

    // 2. Check if it exists
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // 3. CRITICAL: Check if this medicine belongs to the logged-in user
    if (medicine.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 4. Delete it
    await medicine.deleteOne(); // Use deleteOne()
    res.status(200).json({ message: 'Medicine removed' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Get all medicines below their low stock threshold
// @route   GET /api/medicines/alerts/low-stock
// @access  Private
export const getLowStockAlerts = async (req, res) => {
  try {
    // 1. Find medicines where quantity is less than or equal to the threshold
    // We use $expr to compare two fields in the same document
    const lowStockItems = await Medicine.find({ 
      user: req.user.id,
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] } 
    }).sort({ quantity: 1 }); // Show lowest quantity first

    // 2. Send them back
    res.status(200).json(lowStockItems);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all medicines nearing expiry
// @route   GET /api/medicines/alerts/expiry
// @access  Private
export const getExpiryAlerts = async (req, res) => {
  try {
    const today = new Date();
    // Calculate the date 90 days from now
    const next90Days = new Date(today.setDate(today.getDate() + 90));

    // 1. Find medicines that are...
    const expiringItems = await Medicine.find({
      user: req.user.id, // ...for this user
      expiryDate: { 
        $lte: next90Days // ...expiring within the next 90 days
      }
    }).sort({ expiryDate: 1 }); // Show soonest-to-expire first

    // 2. Send them back
    res.status(200).json(expiringItems);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all medicines that are out of stock (quantity = 0)
// @route   GET /api/medicines/alerts/out-of-stock
// @access  Private
export const getOutOfStockAlerts = async (req, res) => {
  try {
    const outOfStockItems = await Medicine.find({ 
      user: req.user.id,
      quantity: 0 
    });
    res.status(200).json(outOfStockItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
import Medicine from '../models/medicine.model.js';

// ==============================
// 1. ADD MEDICINE
// ==============================
export const addMedicine = async (req, res) => {
  try {
    const { name, barcode, batchNumber, stock, price, expiryDate } = req.body;

    if (!name || !stock || !price || !expiryDate) {
      return res.status(400).json({ message: "Name, Stock, Price, and Expiry are required" });
    }

    // Check if Batch ID exists
    if (batchNumber) {
        const existingBatch = await Medicine.findOne({ user: req.user._id, batchId: batchNumber });
        if (existingBatch) {
            return res.status(400).json({ message: `Batch ${batchNumber} already exists. Please update stock instead.` });
        }
    }

    const newMedicine = new Medicine({
      user: req.user._id,
      name,
      barcode: barcode || '', // ✅ Save Barcode
      batchId: batchNumber || `BATCH-${Date.now()}`, 
      stock: Number(stock),
      mrp: Number(price),
      expiryDate,
      category: "General"
    });

    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);

  } catch (error) {
    console.error("Add Medicine Error:", error);
    res.status(400).json({ message: error.message || "Server Error" });
  }
};

// ==============================
// 2. GET ALL MEDICINES
// ==============================
export const getMedicines = async (req, res) => {
  try {
    // Sort by Expiry Date (FIFO)
    const medicines = await Medicine.find({ user: req.user._id }).sort({ expiryDate: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==============================
// 3. UPDATE MEDICINE
// ==============================
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);

    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    if (medicine.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==============================
// 4. DELETE MEDICINE
// ==============================
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    if (medicine.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await medicine.deleteOne();
    res.json({ message: "Medicine removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==============================
// 5. GET LOW STOCK ALERTS
// ==============================
export const getLowStockAlerts = async (req, res) => {
  try {
    const lowStockMedicines = await Medicine.find({
      user: req.user._id,
      stock: { $lte: 10, $gt: 0 }
    });
    res.json(lowStockMedicines);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==============================
// 6. GET EXPIRY ALERTS
// ==============================
export const getExpiryAlerts = async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringMedicines = await Medicine.find({
      user: req.user._id,
      expiryDate: { $lt: thirtyDaysFromNow, $gt: new Date() }
    });
    res.json(expiringMedicines);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==============================
// 7. GET OUT OF STOCK ALERTS
// ==============================
export const getOutOfStockAlerts = async (req, res) => {
  try {
    const outOfStockMedicines = await Medicine.find({
      user: req.user._id,
      stock: { $lte: 0 }
    });
    res.json(outOfStockMedicines);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
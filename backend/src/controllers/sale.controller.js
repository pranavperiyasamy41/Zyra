import Sale from '../models/sale.model.js';
import Medicine from '../models/medicine.model.js';

// 1. CREATE SALE
export const createSale = async (req, res) => {
  try {
    const { items, totalAmount, customerName, customerMobile } = req.body;

    // Validate Input
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Decrease Stock Logic
    for (const item of items) {
       if (!item.medicineId) {
         return res.status(400).json({ message: `Invalid item in cart: ${item.name}` });
       }

       // Find medicine by ID
       let medicine = await Medicine.findById(item.medicineId);
       
       // Fallback: If not found by ID, try Name
       if (!medicine) {
         medicine = await Medicine.findOne({ name: item.name, user: req.user._id });
       }

       if (!medicine) {
          return res.status(404).json({ message: `Medicine not found in inventory: ${item.name}` });
       }

       // 🛡️ SAFEGUARD: Handle "Ghost" Numbers
       // Ensure we treat existing stock as a number. If missing, treat as 0.
       const currentStock = Number(medicine.stock) || Number(medicine.quantity) || 0;

       if (currentStock < item.quantity) {
         return res.status(400).json({ message: `Insufficient stock for ${item.name}. Available: ${currentStock}` });
       }

       // ✅ Calculate New Stock safely
       const newStock = Math.max(0, currentStock - item.quantity);

       // Update both fields to keep them in sync and clean up the DB
       medicine.stock = newStock;
       medicine.quantity = newStock; 
       
       await medicine.save();
    }

    // Create Sale Record
    const sale = new Sale({
      user: req.user._id,
      customerName: customerName || 'Guest',
      customerMobile: customerMobile || '',
      items,
      totalAmount
    });

    const createdSale = await sale.save();
    res.status(201).json(createdSale);

  } catch (error) { 
    console.error("Sale Error Details:", error); 
    res.status(500).json({ message: error.message || "Server Error processing sale" }); 
  }
};

// 2. GET ALL SALES
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

// 3. GET LAST ORDER
export const getLastOrder = async (req, res) => {
  try {
    const { mobile } = req.params;
    const sale = await Sale.findOne({ 
      user: req.user._id, 
      customerMobile: mobile 
    }).sort({ createdAt: -1 });

    if (!sale) return res.status(404).json({ message: "No history found" });
    res.json(sale);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};
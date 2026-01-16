import Sale from '../models/sale.model.js';
import Medicine from '../models/medicine.model.js';

// 1. CREATE SALE
export const createSale = async (req, res) => {
  try {
    const { items, totalAmount, customerName, customerMobile } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Decrease Stock Logic
    for (const item of items) {
       if (!item.medicineId) {
         return res.status(400).json({ message: `Invalid item in cart: ${item.name}` });
       }

       let medicine = await Medicine.findById(item.medicineId);
       
       if (!medicine) {
          return res.status(404).json({ message: `Stock not found for: ${item.name}` });
       }

       const currentStock = Number(medicine.stock) || 0;

       if (currentStock < item.quantity) {
         return res.status(400).json({ 
             message: `Insufficient stock for ${medicine.name} (${medicine.batchId}). Available: ${currentStock}` 
         });
       }

       const newStock = Math.max(0, currentStock - item.quantity);

       medicine.stock = newStock;
       await medicine.save();
    }

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

// 4. 🔮 GET AI PREDICTIONS (New!)
export const getSalesPredictions = async (req, res) => {
  try {
    // 1. Get sales from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sales = await Sale.find({ 
        user: req.user._id,
        createdAt: { $gte: thirtyDaysAgo }
    });

    // 2. Calculate Total Sold per Medicine
    const salesMap = {}; // { "Dolo 650": 150, "Crosin": 20 }
    
    sales.forEach(sale => {
        sale.items.forEach(item => {
            salesMap[item.name] = (salesMap[item.name] || 0) + item.quantity;
        });
    });

    // 3. Compare with Current Stock to Predict Runout
    const inventory = await Medicine.find({ user: req.user._id });
    const predictions = [];

    inventory.forEach(med => {
        const soldLast30Days = salesMap[med.name] || 0;
        const dailyVelocity = soldLast30Days / 30; // Avg sold per day

        // Only predict if selling somewhat regularly (> 0.5 per day)
        if (dailyVelocity > 0.5) {
            const daysLeft = Math.floor(med.stock / dailyVelocity);
            
            if (daysLeft < 7) { // Alert if running out in next 7 days
                predictions.push({
                    name: med.name,
                    daysLeft: daysLeft,
                    dailyRate: dailyVelocity.toFixed(1),
                    currentStock: med.stock
                });
            }
        }
    });

    res.json(predictions.sort((a,b) => a.daysLeft - b.daysLeft)); // Show most urgent first
  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
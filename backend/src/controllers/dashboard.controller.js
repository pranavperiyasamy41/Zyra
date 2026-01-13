import Medicine from '../models/medicine.model.js';
import Sale from '../models/sale.model.js'; // Make sure this model exists

export const getDashboardStats = async (req, res) => {
  try {
    const totalStock = await Medicine.countDocuments({ user: req.user._id });
    
    const lowStock = await Medicine.find({ 
      user: req.user._id, 
      stock: { $lte: 10 } 
    });

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringSoon = await Medicine.find({
      user: req.user._id,
      expiryDate: { $lt: thirtyDaysFromNow, $gt: new Date() }
    });

    // Calculate Revenue
    const sales = await Sale.find({ user: req.user._id });
    const totalRevenue = sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    res.json({
      totalRevenue,
      totalStock,
      lowStock,
      expiringSoon
    });
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};
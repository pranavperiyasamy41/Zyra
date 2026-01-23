import Medicine from '../models/medicine.model.js';
import Sale from '../models/sale.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Define Time Ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 2. Aggregate Sales Data (Revenue Triad)
    const salesStats = await Sale.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          todayRevenue: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfToday] }, "$totalAmount", 0]
            }
          },
          monthRevenue: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", startOfMonth] }, "$totalAmount", 0]
            }
          }
        }
      }
    ]);

    const stats = salesStats[0] || { totalRevenue: 0, todayRevenue: 0, monthRevenue: 0 };

    // 3. Inventory Stats
    const totalStock = await Medicine.countDocuments({ user: userId });
    
    // Low Stock (<= 10 units)
    const lowStockCount = await Medicine.countDocuments({ 
      user: userId, 
      $expr: { $lte: [{ $ifNull: ["$stock", "$quantity"] }, 10] } 
    });

    // 4. Expiry Risk Analysis (Next 30 Days) & Monetization
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    // We use .find() instead of count() so we can calculate the value
    const expiringItems = await Medicine.find({
      user: userId,
      expiryDate: { $lte: thirtyDaysFromNow, $gt: now },
      $expr: { $gt: [{ $ifNull: ["$stock", "$quantity"] }, 0] }
    });

    const expiringCount = expiringItems.length;
    
    // 💰 Calculate Potential Loss (Stock * Price)
    // Uses 'price' or 'mrp' depending on what you saved. Defaults to 0 if missing.
    const expiringValue = expiringItems.reduce((acc, item) => {
        const qty = item.stock || item.quantity || 0;
        const price = item.price || item.mrp || 0;
        return acc + (qty * price);
    }, 0);

    res.json({
      revenue: stats.totalRevenue,
      revenueToday: stats.todayRevenue,
      revenueMonth: stats.monthRevenue,
      totalStock,
      lowStock: lowStockCount,
      expiring: expiringCount,
      expiringValue // 🆕 Sending the dollar value
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
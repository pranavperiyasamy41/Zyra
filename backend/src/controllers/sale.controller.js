import mongoose from 'mongoose';
import { z } from 'zod';
import Sale from '../models/sale.model.js';
import Medicine from '../models/medicine.model.js';
import sendEmail from '../utils/sendEmail.js';

// Validation Schema
const saleItemSchema = z.object({
  medicineId: z.string().min(1, "Medicine ID is required"),
  name: z.string().min(1, "Medicine Name is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  price: z.number().nonnegative("Price cannot be negative")
});

const createSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "Cart cannot be empty"),
  totalAmount: z.number().nonnegative(),
  customerName: z.string().optional(),
  customerMobile: z.string().optional()
});

// 1. CREATE SALE (With Transaction & Validation)
export const createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Validate Input
    const validationResult = createSaleSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: validationResult.error.format() 
      });
    }

    const { items, totalAmount, customerName, customerMobile } = validationResult.data;
    
    const LOW_STOCK_THRESHOLD = 10;
    const lowStockAlerts = [];

    // 2. Process Items & Update Stock
    for (const item of items) {
       // Lock the medicine document for update using the session
       const medicine = await Medicine.findById(item.medicineId).session(session);
       
       if (!medicine) {
          throw new Error(`Stock not found for: ${item.name}`);
       }

       // 🔒 Security: Ensure medicine belongs to the authenticated user
       if (medicine.user.toString() !== req.user._id.toString()) {
          throw new Error(`Unauthorized access to medicine: ${item.name}`);
       }

       const currentStock = Number(medicine.stock) || 0;

       if (currentStock < item.quantity) {
         throw new Error(`Insufficient stock for ${medicine.name} (${medicine.batchId}). Available: ${currentStock}`);
       }

       const newStock = currentStock - item.quantity;
       
       // 🚨 Check for Low Stock Cross (only alert if it JUST dropped below threshold)
       if (currentStock > LOW_STOCK_THRESHOLD && newStock <= LOW_STOCK_THRESHOLD) {
          lowStockAlerts.push({ name: medicine.name, remaining: newStock });
       }

       medicine.stock = newStock;
       await medicine.save({ session });
    }

    // 3. Create Sale Record
    const sale = new Sale({
      user: req.user._id,
      customerName: customerName || 'Guest',
      customerMobile: customerMobile || '',
      items,
      totalAmount
    });

    const createdSale = await sale.save({ session });

    // 4. Commit Transaction
    await session.commitTransaction();
    session.endSession();

    // 📧 Send Alerts (Async - don't block response)
    if (lowStockAlerts.length > 0) {
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #d32f2f;">⚠️ Low Stock Alert</h2>
                <p>The following items have dropped below the safety threshold (${LOW_STOCK_THRESHOLD}):</p>
                <ul>
                    ${lowStockAlerts.map(i => `<li><strong>${i.name}</strong>: Only ${i.remaining} left</li>`).join('')}
                </ul>
                <p>Please restock soon to avoid shortages.</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/inventory" style="background-color: #0288d1; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Go to Inventory</a>
            </div>
        `;
        sendEmail(req.user.email, "⚠️ Action Required: Low Stock Alert", emailHtml)
            .catch(err => console.error("Failed to send alert email:", err));
    }

    res.status(201).json(createdSale);

  } catch (error) { 
    await session.abortTransaction();
    session.endSession();
    console.error("Sale Transaction Error:", error); 
    
    // Distinguish between our logic errors and system errors
    const statusCode = error.message.includes("Insufficient stock") || error.message.includes("Stock not found") ? 400 : 500;
    
    res.status(statusCode).json({ message: error.message || "Server Error processing sale" }); 
  }
};

// 2. GET ALL SALES (With Pagination & Filtering)
export const getSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { date, month, search, startDate, endDate } = req.query;

    let query = { user: req.user._id };

    // Date Range Filter (Custom Range)
    if (startDate && endDate) {
        query.createdAt = { 
            $gte: new Date(startDate), 
            $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) 
        };
    }
    // Date Filter (Specific Date)
    else if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.createdAt = { $gte: start, $lt: end };
    }
    // Month Filter (e.g., "2023-10")
    else if (month) {
      const [year, m] = month.split('-');
      const startDate = new Date(year, m - 1, 1);
      const endDate = new Date(year, m, 0); // Last day of month
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    // Search Filter
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerMobile: { $regex: search, $options: 'i' } }
      ];
    }

    const totalDocs = await Sale.countDocuments(query);
    const sales = await Sale.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: sales,
      pagination: {
        total: totalDocs,
        page,
        limit,
        totalPages: Math.ceil(totalDocs / limit)
      }
    });
  } catch (error) { 
    console.error("Get Sales Error:", error);
    res.status(500).json({ message: "Server Error" }); 
  }
};

// 3. GET SALES ANALYTICS
export const getSalesAnalytics = async (req, res) => {
  try {
    const { date, month, startDate, endDate } = req.query;
    let matchStage = { user: req.user._id };

    if (startDate && endDate) {
        matchStage.createdAt = { 
            $gte: new Date(startDate), 
            $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) 
        };
    } else if (date) {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);
        matchStage.createdAt = { $gte: start, $lt: end };
    } else if (month) {
        const [year, m] = month.split('-');
        const startDate = new Date(year, m - 1, 1);
        const endDate = new Date(year, m, 0);
        matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }

    const stats = await Sale.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          averageOrder: { $avg: "$totalAmount" }
        }
      }
    ]);

    res.json(stats[0] || { totalRevenue: 0, totalOrders: 0, averageOrder: 0 });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. GET LAST ORDER
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

// 5. RESET SALES DATA (Danger Zone)
export const resetSalesData = async (req, res) => {
  try {
    const result = await Sale.deleteMany({ user: req.user._id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No sales data found to delete." });
    }

    res.json({ message: `Successfully deleted ${result.deletedCount} sale records.` });
  } catch (error) {
    console.error("Reset Sales Error:", error);
    res.status(500).json({ message: "Server Error during reset." });
  }
};

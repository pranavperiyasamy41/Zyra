import User from '../models/user.model.js';
import Medicine from '../models/medicine.model.js';

// 1. GET DASHBOARD METRICS
export const getSystemStats = async (req, res) => {
  try {
    const pendingApprovalsCount = await User.countDocuments({ status: 'PENDING' });
    const lowStockCount = await Medicine.countDocuments({ stock: { $lte: 10 } });

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiryAlertsCount = await Medicine.countDocuments({ 
      expiryDate: { $lt: thirtyDaysFromNow, $gt: new Date() } 
    });

    res.json({
      pendingApprovalsCount,
      lowStockCount,
      expiryAlertsCount,
      suspiciousAlertsCount: 0 
    });
  } catch (error) {
    console.error("Metrics Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    // Determine which roles to fetch. Usually, we want all except superadmins.
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) { 
    res.status(500).json({ message: "Server Error" }); 
  }
};

// 3. GET PENDING USERS
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'PENDING' }).select('-password');
    res.json(users);
  } catch (error) { 
    res.status(500).json({ message: "Server Error" }); 
  }
};

// 4. APPROVE USER
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    user.status = 'APPROVED';
    await user.save();
    
    res.json({ message: "User Approved" });
  } catch (error) { 
    res.status(500).json({ message: "Server Error" }); 
  }
};

// 5. REJECT / DELETE USER
export const rejectUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User Deleted/Rejected" });
  } catch (error) { 
    res.status(500).json({ message: "Server Error" }); 
  }
};

// 6. UPDATE USER ROLE (The New Function)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent changing your own role
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role." });
    }

    user.role = role;
    await user.save();
    
    res.json({ message: `User role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
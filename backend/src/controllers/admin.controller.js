import User from '../models/user.model.js';
import Medicine from '../models/medicine.model.js';
import AuditLog from '../models/auditLog.model.js';
import sendEmail from '../utils/sendEmail.js';

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
    
    // 1. Update Status
    user.status = 'APPROVED';
    await user.save();
    
    // 2. Log Action
    await AuditLog.create({
        actorId: req.user._id, actorName: req.user.username,
        action: "USER_APPROVED", details: `Approved user: ${user.username}`
    });

    // 3. Send Email (✅ REBRANDED)
    const emailSubject = "🎉 Account Approved - Zyra";
    const emailHtml = `
      <h3>Welcome to Zyra!</h3>
      <p>Hello <strong>${user.username}</strong>,</p>
      <p>Your account for <strong>${user.pharmacyName}</strong> has been approved.</p>
      <p>You can now login to your dashboard.</p>
      <p><em>- The Zyra Team</em></p>
    `;
    sendEmail(user.email, emailSubject, emailHtml);

    res.json({ message: "User Approved & Email Sent" });
  } catch (error) { 
    console.error("Approval Error:", error);
    res.status(500).json({ message: "Server Error" }); 
  }
};

// 5. REJECT / DELETE USER
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
        await User.findByIdAndDelete(req.params.id);
        
        // Log Action
        await AuditLog.create({
            actorId: req.user._id, actorName: req.user.username,
            action: "USER_DELETED", details: `Deleted/Rejected user: ${user.username}`
        });
    }
    res.json({ message: "User Deleted/Rejected" });
  } catch (error) { 
    res.status(500).json({ message: "Server Error" }); 
  }
};

// 6. UPDATE USER ROLE
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role." });
    }

    user.role = role;
    await user.save();
    
    await AuditLog.create({
        actorId: req.user._id, actorName: req.user.username,
        action: "ROLE_UPDATED", details: `Changed ${user.username} role to ${role}`
    });

    res.json({ message: `User role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 7. GET AUDIT LOGS
export const getAuditLogs = async (req, res) => {
  try {
    const { action, search } = req.query;
    let query = {};

    if (action) {
      query.action = action;
    }

    if (search) {
      query.actorName = { $regex: search, $options: 'i' };
    }

    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
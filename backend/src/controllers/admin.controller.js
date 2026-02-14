import User from '../models/user.model.js';
import Medicine from '../models/medicine.model.js';
import AuditLog from '../models/auditLog.model.js';
import Sale from '../models/sale.model.js'; 
import Ticket from '../models/ticket.model.js'; // 🆕 Import Ticket
import SystemSettings from '../models/systemSettings.model.js'; 
import sendEmail from '../utils/sendEmail.js';
import { getIp } from '../utils/getIp.js';

// 1. GET DASHBOARD METRICS
export const getSystemStats = async (req, res) => {
  try {
    const pendingApprovalsCount = await User.countDocuments({ status: 'PENDING' });
    
    // 🟢 Active Users (Unique Logins in last 24h)
    const twentyFourHoursAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const activeUsersRaw = await AuditLog.aggregate([
        { $match: { action: { $in: ['LOGIN', 'LOGIN_ADMIN'] }, createdAt: { $gte: twentyFourHoursAgo } } },
        { $group: { _id: "$actorId" } },
        { $count: "count" }
    ]);
    const activeUsersCount = activeUsersRaw[0]?.count || 0;

    // 🟢 Open Support Tickets
    const openTicketsCount = await Ticket.countDocuments({ status: 'OPEN' });

    res.json({
      pendingApprovalsCount,
      activeUsersCount,
      openTicketsCount,
      suspiciousAlertsCount: 0 // Placeholder or can be removed if not used
    });
  } catch (error) {
    console.error("Metrics Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 11. GLOBAL SALES ANALYTICS
export const getGlobalSalesAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30; // Default to 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesData = await Sale.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(salesData);
  } catch (error) {
    console.error("Analytics Error:", error);
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
        action: "USER_APPROVED", details: `Approved user: ${user.username}`,
        ipAddress: getIp(req)
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
            action: "USER_DELETED", details: `Deleted/Rejected user: ${user.username}`,
            ipAddress: getIp(req)
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
        action: "ROLE_UPDATED", details: `Changed ${user.username} role to ${role}`,
        ipAddress: getIp(req)
    });

    res.json({ message: `User role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 8. TOGGLE USER SUSPENSION
export const toggleUserSuspension = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (req.user._id.toString() === user._id.toString()) {
        return res.status(400).json({ message: "You cannot suspend yourself." });
      }
  
      user.isSuspended = !user.isSuspended;
      await user.save();
  
      const action = user.isSuspended ? "USER_SUSPENDED" : "USER_ACTIVATED";
      await AuditLog.create({
          actorId: req.user._id, actorName: req.user.username,
          action, 
          details: `${user.isSuspended ? 'Suspended' : 'Re-activated'} user: ${user.username}`,
          ipAddress: getIp(req)
      });
  
      res.json({ message: `User ${user.isSuspended ? 'Suspended' : 'Activated'}`, isSuspended: user.isSuspended });
    } catch (error) {
      console.error("Suspension Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };

// 9. UPDATE USER DETAILS (ADMIN)
export const updateUserDetails = async (req, res) => {
    try {
      const { username, email, pharmacyName, mobile, address, city, state, pincode, drugLicense } = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Update Fields
      user.username = username || user.username;
      user.email = email || user.email;
      user.pharmacyName = pharmacyName || user.pharmacyName;
      user.mobile = mobile || user.mobile;
      user.address = address || user.address;
      user.city = city || user.city;
      user.state = state || user.state;
      user.pincode = pincode || user.pincode;
      user.drugLicense = drugLicense || user.drugLicense;
  
      await user.save();
  
      await AuditLog.create({
          actorId: req.user._id, actorName: req.user.username,
          action: "USER_UPDATED", 
          details: `Updated details for user: ${user.username}`,
          ipAddress: getIp(req)
      });
  
      res.json({ message: "User details updated successfully", user });
    } catch (error) {
      console.error("Update User Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };

// 10. CREATE USER (ADMIN)
export const createUser = async (req, res) => {
  try {
    const { 
      username, email, password, role,
      pharmacyName, mobile, address, city, state, pincode, drugLicense 
    } = req.body;

    // Validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields (Name, Email, Password, Role)." });
    }

    // Check Existence
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User with this email already exists." });

    // Create User (Auto-Approved)
    const newUser = new User({
      username, 
      email, 
      password, 
      role,
      pharmacyName, mobile, address, city, state, pincode, drugLicense,
      status: 'APPROVED', // Direct Approval
      authProvider: 'email'
    });

    await newUser.save();

    // Log Action
    await AuditLog.create({
        actorId: req.user._id, actorName: req.user.username,
        action: "USER_CREATED", 
        details: `Manually created user: ${username} (${role})`,
        ipAddress: getIp(req)
    });

    // Send Welcome Email
    const emailSubject = "🎉 Account Created - Zyra";
    const emailHtml = `
      <h3>Welcome to Zyra!</h3>
      <p>Hello <strong>${username}</strong>,</p>
      <p>An administrator has created an account for you.</p>
      <p><strong>Username/Email:</strong> ${email}<br><strong>Password:</strong> ${password}</p>
      <p>Please login and change your password immediately.</p>
    `;
    sendEmail(email, emailSubject, emailHtml);

    res.status(201).json({ message: "User created successfully", user: newUser });

  } catch (error) {
    console.error("Create User Error:", error);
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

// 12. GET UNVERIFIED USERS
export const getUnverifiedUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      role: 'user', 
      isLicenseVerified: { $ne: true },
      drugLicense: { $exists: true, $ne: "" } 
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 13. VERIFY LICENSE
export const verifyLicense = async (req, res) => {
  try {
    const { status } = req.body; // true (Approve) or false (Reject)
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isLicenseVerified = status;
    await user.save();

    await AuditLog.create({
        actorId: req.user._id, actorName: req.user.username,
        action: status ? "LICENSE_VERIFIED" : "LICENSE_REJECTED", 
        details: `${status ? 'Verified' : 'Rejected'} license for: ${user.username}`,
        ipAddress: getIp(req)
    });

    // Notify User
    const subject = status ? "✅ License Verified" : "⚠️ License Verification Failed";
    const message = status 
      ? `<p>Your pharmacy license has been verified. You now have the 'Verified' badge.</p>`
      : `<p>Your license verification was rejected. Please check your details and try again.</p>`;
    
    sendEmail(user.email, subject, message);

    res.json({ message: `License ${status ? 'Verified' : 'Rejected'}` });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
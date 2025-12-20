import User from '../models/user.model.js';
import Medicine from '../models/medicine.model.js'; // <-- NEW IMPORT

// @desc    Get all registered users in the system (Admin only)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -otp -otpExpires -__v');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving users.' });
  }
};

// @desc    Update a user's role (Admin only)
// @route   PUT /api/admin/users/:id
// @access  Admin
export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Role is required.' });
    }
    
    // SECURITY CHECK: Prevent admin from changing their own role
    if (userId === req.user.id.toString()) {
        return res.status(403).json({ message: 'You cannot change your own role.' });
    }

    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    res.status(200).json({ message: 'User role updated successfully.', user: userToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating user.' });
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // SECURITY CHECK: Prevent admin from deleting their own account
    if (userId === req.user.id.toString()) {
        return res.status(403).json({ message: 'You cannot delete your own account.' });
    }
    
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
};

// -------------------------------------------------------------
// --- NEW FUNCTION: GET ADMIN DASHBOARD METRICS (for dashboard cards) ---
// -------------------------------------------------------------
export const getAdminMetrics = async (req, res) => {
    try {
        // 1. Pending Approvals
        const pendingApprovalsCount = await User.countDocuments({ isApproved: false });

        // 2. Low Stock (System-wide count for Admin)
        const lowStockCount = await Medicine.countDocuments({ quantity: { $lte: 10 } });

        // 3. Expiry Alerts (Expiring in the next 30 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        const expiryAlertsCount = await Medicine.countDocuments({ 
            expiryDate: { $lte: expiryDate },
            quantity: { $gt: 0 } 
        });

        // 4. Placeholder for future alerts
        const suspiciousAlertsCount = 0; 

        res.status(200).json({
            pendingApprovalsCount,
            lowStockCount,
            expiryAlertsCount,
            suspiciousAlertsCount,
        });
    } catch (error) {
        console.error("Metrics Error:", error);
        res.status(500).json({ message: 'Server error retrieving metrics.' });
    }
};

// -----------------------------------------------------------------
// --- NEW FUNCTION: SET USER APPROVAL STATUS (Approve/Reject) ---
// -----------------------------------------------------------------
export const setUserApprovalStatus = async (req, res) => {
    try {
        const { isApproved } = req.body;
        const userId = req.params.id;

        if (typeof isApproved !== 'boolean') {
            return res.status(400).json({ message: 'isApproved status must be true or false.' });
        }

        // Prevent admin from un-approving themselves if already approved
        if (userId === req.user.id.toString() && isApproved === false) {
             return res.status(403).json({ message: 'Cannot un-approve your own active account.' });
        }

        const userToUpdate = await User.findById(userId);

        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Update the approval state
        userToUpdate.isApproved = isApproved;
        await userToUpdate.save();
        
        const action = isApproved ? 'approved' : 'rejected';
        res.status(200).json({ message: `User account successfully ${action}.`, user: userToUpdate });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating user approval status.' });
    }
};
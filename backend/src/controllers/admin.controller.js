import User from '../models/user.model.js';

// @desc    Get all registered users in the system (Admin only)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    // Find all users and only return non-sensitive fields
    const users = await User.find({}).select('-password -otp -otpExpires -__v');
    
    // We expect the 'protect' and 'adminProtect' middlewares to handle permissions
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving users.' });
  }
};
import User from '../models/user.model.js';

export const updateUserProfile = async (req, res) => {
  try {
    // 1. Find the user
    const user = await User.findById(req.user._id);

    if (user) {
      // 2. Force Update Fields
      user.username = req.body.username || user.username;
      user.pharmacyName = req.body.pharmacyName || user.pharmacyName;

      // 3. Only update password if provided
      if (req.body.password && req.body.password.length > 0) {
        user.password = req.body.password;
      }

      // 4. Save and return NEW data
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        pharmacyName: updatedUser.pharmacyName,
        role: updatedUser.role,
        token: req.headers.authorization.split(' ')[1] // Send token back just in case
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
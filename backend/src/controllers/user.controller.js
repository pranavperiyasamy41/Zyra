import User from '../models/user.model.js';

// 🆕 Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        pharmacyName: user.pharmacyName,
        avatar: user.avatar,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        drugLicense: user.drugLicense,
        pharmacyContact: user.pharmacyContact,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // 1. Basic Info
      user.username = req.body.username || user.username;
      user.pharmacyName = req.body.pharmacyName || user.pharmacyName;
      user.email = req.body.email || user.email; 
      user.avatar = req.body.avatar || user.avatar; // 🆕 Avatar Update

      // 2. Invoice Settings (Address & License)
      user.address = req.body.address || user.address;
      user.city = req.body.city || user.city;
      user.state = req.body.state || user.state;
      user.pincode = req.body.pincode || user.pincode;
      user.drugLicense = req.body.drugLicense || user.drugLicense;
      user.pharmacyContact = req.body.pharmacyContact || user.pharmacyContact;

      // 3. Security (Password)
      if (req.body.password && req.body.password.length > 0) {
        if (!req.body.currentPassword) {
            res.status(400);
            throw new Error("Current password is required to set a new password");
        }
        
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
            res.status(401);
            throw new Error("Invalid current password");
        }

        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      
      // 4. Return FULL Data for Context Update
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        pharmacyName: updatedUser.pharmacyName,
        avatar: updatedUser.avatar, // 🆕
        // Send back new invoice details
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        pincode: updatedUser.pincode,
        drugLicense: updatedUser.drugLicense,
        pharmacyContact: updatedUser.pharmacyContact,
        token: req.headers.authorization.split(' ')[1] 
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
import User from '../models/user.model.js';

export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'PENDING' });
    res.json(users);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.status = 'APPROVED';
    await user.save();
    res.json({ message: "User Approved" });
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const rejectUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User Rejected" });
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};
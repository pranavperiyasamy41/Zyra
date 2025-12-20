import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import generateToken from '../utils/generateToken.js'; // Ensure this is available

dotenv.config();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordError = 'Password must be at least 8 characters long and contain one uppercase, one lowercase, one number, and one special character.';

// --- NEW FUNCTION 1: Handle Email & Send OTP ---
export const registerEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists AND is already approved (verified)
    const existingUser = await User.findOne({ email, isApproved: true });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    // --- OTP Generation ---
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // We use `upsert` to create a new unverified/unapproved user doc 
    // or update an existing one that is still pending registration.
    await User.updateOne(
      { email, emailVerified: false }, // Find by email and where verification is not yet complete
      { 
        email, 
        otp, 
        otpExpires, 
        emailVerified: false,
        isApproved: false, // Ensure new users are set to unapproved
      },
      { upsert: true }
    );

    // --- !!! FOR TESTING !!! ---
    console.log('===================================');
    console.log(`OTP for ${email}: ${otp}`);
    console.log('===================================');

    res.status(200).json({ message: 'OTP sent to your email (check console).' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- NEW FUNCTION 2: Verify OTP & Finalize Registration ---
export const registerVerify = async (req, res) => {
  try {
    const { email, otp, username, password, pharmacyName } = req.body; // Added pharmacyName

    if (!email || !otp || !username || !password || !pharmacyName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: passwordError });
    }

    // Find the temporary user record
    const user = await User.findOne({ 
      email, 
      emailVerified: false 
    });

    // Check for OTP validity
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
        const message = user?.otpExpires < new Date() ? 'OTP has expired. Please try again.' : 'Invalid OTP or user not found.';
      return res.status(400).json({ message: message });
    }
    
    // --- Success! Update User Details ---
    user.username = username;
    user.pharmacyName = pharmacyName; // Set the pharmacy name
    user.password = password; // The 'pre-save' hook will hash this
    user.emailVerified = true;
    user.isApproved = false; // CRITICAL: Account is still NOT approved by Admin
    user.otp = undefined; 
    user.otpExpires = undefined;

    await user.save(); // This will trigger the password hashing

    res.status(201).json({ message: 'User registered successfully! Awaiting Admin Approval to log in.' }); // Updated message

  } catch (error) {
    // Handle potential duplicate username error
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username is already taken' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- STANDARD USER LOGIN (NEW: Checks isApproved) ---
export const loginUser = async (req, res) => {
    try {
      const { emailOrUsername, password } = req.body;
  
      const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });
  
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email/username or password' });
      }

      // --- CRITICAL: CHECK IF USER IS APPROVED ---
      if (!user.isApproved) {
        return res.status(403).json({ message: 'Access denied. Account is pending admin approval.' });
      }
      // ------------------------------------------

      // Generate token
      const token = generateToken(user._id);
  
      // Send the token back to the user
      res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role, 
      },
  });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during login' });
    }
};

// --- NEW FUNCTION: DEDICATED ADMIN LOGIN (NEW) ---
export const adminLogin = async (req, res) => {
    const { emailOrUsername, password } = req.body;
    
    const user = await User.findOne({ 
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }] 
    });

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // --- CRITICAL ADMIN ROLE CHECK ---
    if (user.role !== 'admin' && user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }
    // ---

    // Admins are not subject to the isApproved check, as they manage approvals.
    
    // Generate token and return admin user data
    const token = generateToken(user._id);

    res.status(200).json({
        message: 'Admin login successful!',
        token: token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
};


// --- FORGOT PASSWORD (Step 1) ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Ensure user is verified AND approved before allowing password reset
    const user = await User.findOne({ email, emailVerified: true, isApproved: true });
    if (!user) {
      return res.status(200).json({ message: 'If an account with this email exists, an OTP has been sent.' });
    }

    // --- OTP Generation and Saving (same as before) ---
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log('===================================');
    console.log(`Password Reset OTP for ${email}: ${otp}`);
    console.log('===================================');

    res.status(200).json({ message: 'If an account with this email exists, an OTP has been sent.' });

  } catch (error){
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- RESET PASSWORD (Step 2) ---
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: passwordError });
    }

    // Find the user with the matching email (must be approved to reset)
    const user = await User.findOne({ email, emailVerified: true, isApproved: true });

    // Check validity
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
        const message = user?.otpExpires < new Date() ? 'OTP has expired. Please try again.' : 'Invalid email or OTP.';
      return res.status(400).json({ message: message });
    }
    
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as your old password.' });
    }

    // --- Success! ---
    user.password = newPassword; 
    user.otp = undefined; 
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
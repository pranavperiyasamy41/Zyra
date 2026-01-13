import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import sendEmail from '../utils/sendEmail.js';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// 1. EMAIL FLOW: SEND OTP
// ==========================================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered. Please Login." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await Otp.findOneAndUpdate(
      { email }, 
      { email, otp }, 
      { upsert: true, new: true }
    );

    await sendEmail(email, "Verify Your Email", `<h3>Your OTP is: ${otp}</h3>`);
    res.status(200).json({ message: "OTP Sent" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// 2. EMAIL FLOW: VERIFY OTP (Intermediate Step)
// ==========================================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, otp });
    
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    // We don't create user yet. Just say "OK" so frontend can move to next step.
    res.status(200).json({ message: "OTP Verified", isVerified: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// 3. FINAL REGISTRATION (WIZARD SUBMISSION)
// ==========================================
export const register = async (req, res) => {
  try {
    const { 
      // Auth Info
      authProvider, googleToken, otp,
      // User Info
      fullName, email, mobile, password,
      // Pharmacy Info
      pharmacyName, drugLicense, address, city, state, pincode, pharmacyContact
    } = req.body;

    // --- SECURITY CHECKS ---
    if (authProvider === 'google') {
      // 🛡️ Verify Google Token Integrity
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (payload.email !== email) return res.status(400).json({ message: "Security Alert: Email mismatch." });
    } else {
      // 🛡️ Verify OTP one last time to prevent skipping step
      const validOtp = await Otp.findOne({ email, otp });
      if (!validOtp) return res.status(400).json({ message: "Session expired. Please verify OTP again." });
      await Otp.deleteOne({ email }); // Cleanup
    }

    // --- UNIQUENESS CHECKS ---
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already exists." });

    const licenseExists = await User.findOne({ drugLicense });
    if (licenseExists) return res.status(400).json({ message: "Drug License Number already registered." });

    // --- CREATE USER ---
    const newUser = new User({
      username: fullName,
      email,
      mobile,
      password: password || "", // Empty for Google users
      pharmacyName,
      drugLicense,
      address,
      city,
      state,
      pincode,
      pharmacyContact,
      authProvider,
      status: 'PENDING' // ⛔ Default Status
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Registration Successful! Account is pending admin approval." 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration Failed" });
  }
};

// ==========================================
// 4. LOGIN (With Approval Check)
// ==========================================
export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    // Find User
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    // ⛔ CHECK APPROVAL STATUS
    if (user.status !== 'APPROVED' && user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Account not active. Please wait for Admin Approval." 
      });
    }

    // ✅ FIXED LOGIC: Treat missing authProvider as 'email' (for legacy users)
    if (!user.authProvider || user.authProvider === 'email') {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    } else {
       // Only block if they are explicitly a Google user trying to use a password
       return res.status(400).json({ message: "Please Login with Google" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.username,
        username: user.username,
        email: user.email,
        pharmacyName: user.pharmacyName, 
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// 5. GOOGLE LOGIN (For Existing Users)
// ==========================================
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email } = ticket.getPayload();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered. Please Sign Up first." });
    }

    // ⛔ CHECK APPROVAL STATUS
    if (user.status !== 'APPROVED' && user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Account not active. Please wait for Admin Approval." 
      });
    }

    // Success
    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.username,
        username: user.username,
        email: user.email,
        // ✅ CRITICAL FIX: Added here too for Google Users
        pharmacyName: user.pharmacyName,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Google Login Failed" });
  }
};
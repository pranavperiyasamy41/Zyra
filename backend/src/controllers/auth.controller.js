import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import sendEmail from '../utils/sendEmail.js';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// 1. EMAIL FLOW: SEND OTP (Unchanged)
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
// 2. EMAIL FLOW: VERIFY OTP (Unchanged)
// ==========================================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, otp });
    
    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    res.status(200).json({ message: "OTP Verified", isVerified: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// 3. FINAL REGISTRATION (Unchanged)
// ==========================================
export const register = async (req, res) => {
  try {
    const { 
      authProvider, googleToken, otp,
      fullName, username, email, mobile, password, 
      pharmacyName, drugLicense, address, city, state, pincode, pharmacyContact
    } = req.body;

    // 1. MAP DATA
    const finalUsername = username || fullName;

    // 2. SECURITY CHECKS
    if (authProvider === 'google') {
       const ticket = await client.verifyIdToken({ idToken: googleToken, audience: process.env.GOOGLE_CLIENT_ID });
       const payload = ticket.getPayload();
       if (payload.email !== email) return res.status(400).json({ message: "Email mismatch." });
    } else {
       const validOtp = await Otp.findOne({ email, otp });
       if (!validOtp) return res.status(400).json({ message: "Invalid or Expired OTP." });
       await Otp.deleteOne({ email }); 
    }

    // 3. UNIQUENESS CHECKS
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already exists." });

    const usernameExists = await User.findOne({ username: finalUsername });
    if (usernameExists) return res.status(400).json({ message: "Username is already taken." });

    if (drugLicense) {
        const licenseExists = await User.findOne({ drugLicense });
        if (licenseExists) return res.status(400).json({ message: "Drug License Number already registered." });
    }

    // 4. CREATE USER (Password is saved here if provided!)
    const newUser = new User({
      username: finalUsername,
      email,
      mobile,
      password: password || "", 
      pharmacyName,
      drugLicense,
      address,
      city,
      state,
      pincode,
      pharmacyContact,
      authProvider,
      status: 'PENDING',
      role: 'user'
    });

    await newUser.save();

    res.status(201).json({ message: "Registration Successful! Account is pending admin approval." });

  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === 11000) {
        return res.status(400).json({ message: "Error: Email or License already registered." });
    }
    res.status(500).json({ message: error.message || "Registration Failed" });
  }
};

// ==========================================
// 4. LOGIN (✅ UPDATED for Hybrid Auth)
// ==========================================
export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    // ⛔ APPROVAL CHECK
    if (user.status !== 'APPROVED' && user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({ 
        message: "Account pending approval. Please contact Admin." 
      });
    }

    // ✅ HYBRID AUTH CHANGE:
    // Instead of blocking Google users, we check the password for EVERYONE.
    const isMatch = await user.matchPassword(password);
    
    if (isMatch) {
        // Success!
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
    } else {
        // Failure Message Logic
        if (user.authProvider === 'google') {
             // Helpful hint for Google users who might have forgotten they set a password
             return res.status(400).json({ message: "Invalid Password. Try logging in with Google." });
        }
        return res.status(400).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ==========================================
// 5. GOOGLE LOGIN (Unchanged)
// ==========================================
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email } = ticket.getPayload();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered. Please Sign Up first." });
    }

    if (user.status !== 'APPROVED' && user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Account not active. Please wait for Admin Approval." 
      });
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
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Google Login Failed" });
  }
};

// ==========================================
// 6. ADMIN LOGIN (Unchanged)
// ==========================================
export const adminLogin = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) return res.status(400).json({ message: "Admin account not found" });

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({ message: "Access Denied: You are not an Administrator." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Admin Credentials" });

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
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
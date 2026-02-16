import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import AuditLog from '../models/auditLog.model.js';
import SystemSettings from '../models/systemSettings.model.js'; // 🆕 Import
import sendEmail from '../utils/sendEmail.js';
import generateToken from '../utils/generateToken.js';
import { getIp } from '../utils/getIp.js';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🟢 HELPER: Standardize User Response
const getUserResponse = (user) => ({
  _id: user._id,
  name: user.username,
  username: user.username,
  email: user.email,
  role: user.role,
  pharmacyName: user.pharmacyName,
  avatar: user.avatar, // 🆕 Added to persist profile photo
  address: user.address,
  city: user.city,
  state: user.state,
  pincode: user.pincode,
  drugLicense: user.drugLicense,
  pharmacyContact: user.pharmacyContact
});

// 🟢 HELPER: Designer Email Template ✉️
const getEmailTemplate = (otp, type) => {
  const isReset = type === 'RESET';
  const color = isReset ? '#e11d48' : '#2563eb'; 
  const title = isReset ? 'Reset Your Password' : 'Verify Your Account';
  
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #f0f0f0;">
      
      <div style="background: linear-gradient(135deg, ${color}, #1e293b); padding: 40px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">ZYRA</h1>
        <p style="color: rgba(255,255,255,0.8); margin-top: 10px; font-size: 14px;">Intelligent Pharmacy OS</p>
      </div>
      
      <div style="padding: 40px 30px; text-align: center;">
        <div style="background-color: ${isReset ? '#fff1f2' : '#eff6ff'}; display: inline-block; padding: 12px 24px; border-radius: 50px; margin-bottom: 20px;">
          <h2 style="color: ${color}; font-size: 16px; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">${isReset ? 'Password Reset' : 'Account OTP'}</h2>
        </div>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px; padding: 0 20px;">
          Use the secure <strong>OTP</strong> below to complete your request. This code expires in <strong>5 minutes</strong>.
        </p>
        
        <div style="background-color: #1e293b; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 20px 40px; border-radius: 12px; display: inline-block; margin-bottom: 30px; font-family: 'Courier New', monospace;">
          ${otp}
        </div>

        <p style="color: #94a3b8; font-size: 13px; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
          If you didn't request this, you can safely ignore this email. Your account remains secure.
        </p>
      </div>

      <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #cbd5e1; font-size: 12px; margin: 0;">&copy; 2026 Zyra Systems. Automated Message.</p>
      </div>
    </div>
  `;
};

// ========================================== 
// AUTH CONTROLLERS
// ========================================== 

export const checkUserExists = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Check User Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered. Please Login." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate({ email }, { email, otp }, { upsert: true, new: true });

    await sendEmail(email, "Verify Your Email", getEmailTemplate(otp, 'VERIFY'));
    
    res.status(200).json({ message: "OTP Sent" });
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    
    // 🟢 Refresh Session: Reset expiry to allow time for registration
    record.createdAt = new Date();
    await record.save();

    res.status(200).json({ message: "OTP Verified", isVerified: true });
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const register = async (req, res) => {
  try {
    const { 
      authProvider, googleToken, otp,
      fullName, username, email, mobile, password, 
      pharmacyName, drugLicense, address, city, state, pincode, pharmacyContact
    } = req.body;

    const finalUsername = username || fullName;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const licenseDocument = req.file ? `${baseUrl}/${req.file.path.split('\\').join('/')}` : ""; 

    if (authProvider === 'google') {
       // 🟢 NEW: Verify Access Token via Google API
       const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
          headers: { Authorization: `Bearer ${googleToken}` }
       });
       
       if (!googleResponse.ok) {
           const errText = await googleResponse.text();
           console.error("Register Google Verify Failed:", errText);
           return res.status(400).json({ message: "Invalid Google Token." });
       }

       const googleUser = await googleResponse.json();

       if (!googleUser.email) return res.status(400).json({ message: "Invalid Google Token (No Email)." });
       if (googleUser.email !== email) return res.status(400).json({ message: "Email mismatch with Google Account." });
    } else {
       const validOtp = await Otp.findOne({ email, otp });
       if (!validOtp) return res.status(400).json({ message: "Invalid or Expired OTP." });
       await Otp.deleteOne({ email }); 
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already exists." });

    const usernameExists = await User.findOne({ username: finalUsername });
    if (usernameExists) return res.status(400).json({ message: "Username is already taken." });

    if (drugLicense) {
        const licenseExists = await User.findOne({ drugLicense });
        if (licenseExists) return res.status(400).json({ message: "Drug License Number already registered." });
    }

    const newUser = new User({
      username: finalUsername, email, mobile, password: password || "", pharmacyName, drugLicense, 
      address, city, state, pincode, pharmacyContact, authProvider, status: 'PENDING', role: 'user',
      licenseDocument 
    });

    await newUser.save();
    res.status(201).json({ message: "Registration Successful! Account is pending admin approval." });

  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === 11000) return res.status(400).json({ message: "Error: Email or License already registered." });
    res.status(500).json({ message: error.message || "Registration Failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });

    if (!user) return res.status(400).json({ message: "User not found" });

    // 🛑 MAINTENANCE MODE CHECK (Safe Version)
    const settings = await SystemSettings.getSettings();
    const isAdmin = user.role === 'admin' || user.role === 'superadmin';
    
    if (settings.maintenanceMode && !isAdmin) {
        return res.status(503).json({ message: "🚧 System is under maintenance. Please try again later." });
    }

    if (user.status !== 'APPROVED' && !isAdmin) {
      return res.status(403).json({ message: "Account pending approval. Please contact Admin." });
    }

    if (user.isSuspended) {
        return res.status(403).json({ message: "Account Suspended. Please contact Support." });
    }

    const isMatch = await user.matchPassword(password);
    
    if (isMatch) {
        await AuditLog.create({
            actorId: user._id, actorName: user.username,
            action: "LOGIN", details: `User logged in via Email`,
            ipAddress: getIp(req)
        });
        res.json({ token: generateToken(user._id), user: getUserResponse(user) });
    } else {
        if (user.authProvider === 'google') return res.status(400).json({ message: "Invalid Password. Try logging in with Google." });
        return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
       console.error("Google Login: No token provided");
       return res.status(400).json({ message: "No authentication token provided" });
    }

    // 🟢 NEW: Verify Access Token
    const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!googleResponse.ok) {
        const errorText = await googleResponse.text();
        console.error(`Google Verification Failed (${googleResponse.status}):`, errorText);
        return res.status(400).json({ message: "Failed to verify Google account. Please try again." });
    }

    const googleUser = await googleResponse.json();

    if (!googleUser.email) {
        console.error("Google Login: No email in response", googleUser);
        return res.status(400).json({ message: "Google account has no email address." });
    }
    
    const email = googleUser.email;

    const user = await User.findOne({ email });
    if (!user) {
        console.warn(`Google Login: User not found for email ${email}`);
        return res.status(404).json({ message: "User not registered. Please Sign Up first." });
    }

    // 🛑 MAINTENANCE MODE CHECK (Safe Version)
    const settings = await SystemSettings.getSettings();
    const isAdmin = user.role === 'admin' || user.role === 'superadmin';

    if (settings.maintenanceMode && !isAdmin) {
        return res.status(503).json({ message: "🚧 System is under maintenance. Please try again later." });
    }

    if (user.status !== 'APPROVED' && !isAdmin) {
      console.warn(`Google Login: User ${email} is pending approval`);
      return res.status(403).json({ message: "Account not active. Please wait for Admin Approval." });
    }

    if (user.isSuspended) {
      console.warn(`Google Login: User ${email} is suspended`);
      return res.status(403).json({ message: "Account Suspended. Please contact Support." });
    }

    await AuditLog.create({
        actorId: user._id, actorName: user.username,
        action: "LOGIN", details: `User logged in via Google`,
        ipAddress: getIp(req)
    });

    res.json({ token: generateToken(user._id), user: getUserResponse(user) });
  } catch (error) {
    console.error("Google Login Critical Error:", error);
    res.status(500).json({ message: "Login Service Error: " + error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });

    if (!user) return res.status(400).json({ message: "Admin account not found" });

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({ message: "Access Denied: You are not an Administrator." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Admin Credentials" });

    await AuditLog.create({
        actorId: user._id, actorName: user.username,
        action: "LOGIN_ADMIN", details: `Admin logged in`,
        ipAddress: getIp(req)
    });

    res.json({ token: generateToken(user._id), user: getUserResponse(user) });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email },
      { email, otp }, 
      { upsert: true, new: true }
    );

    // ✅ USE NEW TEMPLATE
    await sendEmail(email, "🔑 Password Reset Request", getEmailTemplate(otp, 'RESET'));

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword; 
    await user.save();

    await Otp.deleteOne({ email });

    res.json({ message: "Password reset successful! You can now login." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
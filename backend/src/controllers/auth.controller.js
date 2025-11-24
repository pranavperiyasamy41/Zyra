import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordError = 'Password must be at least 8 characters long and contain one uppercase, one lowercase, one number, and one special character.';

// --- NEW FUNCTION 1: Handle Email & Send OTP ---
export const registerEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    // --- OTP Generation ---
    // In a real app, you'd use a library. For our test, we'll use a simple 6-digit code.
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Temporarily save the user or OTP. We can save it on the user document.
    // We'll create a *temporary* user doc that is not yet verified.
    // We use `upsert` to create a new one or update an existing *unverified* one.
    await User.updateOne(
      { email, emailVerified: false },
      { 
        email, 
        otp, 
        otpExpires, 
        emailVerified: false 
      },
      { upsert: true }
    );

    // --- !!! FOR TESTING !!! ---
    // Since we don't have an email server, we'll log the OTP to your backend console.
    console.log('===================================');
    console.log(`OTP for ${email}: ${otp}`);
    console.log('===================================');

    res.status(200).json({ message: 'OTP sent to your email (check console).' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- NEW FUNCTION 2: Verify OTP & Create User ---
export const registerVerify = async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;

    if (!email || !otp || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: passwordError });
    }

    // Find the temporary user record with the matching email
    const user = await User.findOne({ 
      email, 
      emailVerified: false 
    });

    // Check if user exists, if OTP matches, and if OTP is expired
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or user not found' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please try again.' });
    }
    
    // --- Success! ---
    // Update the user with their real details
    user.username = username;
    user.password = password; // The 'pre-save' hook will hash this
    user.emailVerified = true;
    user.otp = undefined; // Clear the OTP fields
    user.otpExpires = undefined;

    await user.save(); // This will trigger the password hashing

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    // Handle potential duplicate username error
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username is already taken' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
    try {
      // 1. Get data from the request
      const { emailOrUsername, password } = req.body;
  
      // 2. Find the user by either email or username
      const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });
  
      // 3. Check if user exists AND if passwords match
      // We use the comparePassword method we wrote in the user model
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email/username or password' });
      }
  
      // 4. User is valid! Create a JWT
      const token = jwt.sign(
        { userId: user._id, username: user.username }, // This is the data stored in the token
        process.env.JWT_SECRET, // The secret key
        { expiresIn: '1d' } // Token expires in 1 day
      );
  
      // 5. Send the token back to the user
      res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role, // <-- ADD THIS LINE
      },
  });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during login' });
    }
  };
// --- NEW FUNCTION: Forgot Password (Step 1) ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email, emailVerified: true });
    if (!user) {
      // We send a success message even if the user doesn't exist
      // This prevents attackers from guessing which emails are registered
      return res.status(200).json({ message: 'If an account with this email exists, an OTP has been sent.' });
    }

    // --- OTP Generation ---
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save the OTP to the user's document
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // --- !!! FOR TESTING !!! ---
    // Log the OTP to your backend console
    console.log('===================================');
    console.log(`Password Reset OTP for ${email}: ${otp}`);
    console.log('===================================');

    res.status(200).json({ message: 'If an account with this email exists, an OTP has been sent.' });

  } catch (error){
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- NEW FUNCTION: Reset Password (Step 2) ---
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: passwordError });
    }

    // Find the user with the matching email
    const user = await User.findOne({ email, emailVerified: true });

    // Check if user exists, if OTP matches, and if OTP is expired
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or user not found' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please try again.' });
    }
    
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as your old password.' });
    }

    // --- Success! ---
    // Set the new password
    user.password = newPassword; // The 'pre-save' hook will hash this
    user.otp = undefined; // Clear the OTP fields
    user.otpExpires = undefined;

    await user.save(); // This will trigger the password hashing

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
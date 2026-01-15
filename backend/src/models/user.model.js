import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  // Core Info
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  
  // Pharmacy Details
  pharmacyName: { type: String },
  drugLicense: { 
    type: String, 
    unique: true, 
    sparse: true // ✅ CRITICAL FIX: Allows multiple users (like Admins) to have NO license
  },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  pharmacyContact: { type: String },

  // Role & Status
  role: { 
    type: String, 
    enum: ['user', 'admin', 'superadmin'], 
    default: 'user' 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  authProvider: { type: String, default: 'email' },
}, { timestamps: true });

// Password Encryption
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
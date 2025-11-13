import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      // required: true, <-- REMOVE THIS
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true, // Allows multiple null/undefined usernames (until they're set)
    },
    password: {
      type: String,
      // required: true, <-- REMOVE THIS
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    
    // --- ADD THESE FIELDS ---
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    // ---
    
    pharmacyName: {
      type: String,
      default: 'My Pharmacy',
    },
  },
  {
    timestamps: true, 
  }
);

// ... your 'pre-save' hook and 'comparePassword' method are unchanged ...
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
export default User;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    // Try to connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('MongoDB connected successfully!');
  } catch (error) {
    // If connection fails, log the error and exit the server
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
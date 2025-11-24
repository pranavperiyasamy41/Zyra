import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import medicineRoutes from './src/routes/medicine.routes.js'; // <-- 1. Import new routes
import connectDB from './src/config/db.config.js'; // <-- 1. Import the connection
import saleRoutes from './src/routes/sale.routes.js'; // <-- 1. Import new routes
import noteRoutes from './src/routes/note.routes.js';
import adminRoutes from './src/routes/admin.routes.js'; // <-- 1. Import Admin Routes
// Load .env variables
dotenv.config();

// --- Connect to the Database ---
connectDB(); // <-- 2. Call the connection function

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// --- Define our main routes ---
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes); // <-- 2. Add the medicine routes
app.use('/api/sales', saleRoutes); // <-- 2. Add the sales routes
app.use('/api/notes', noteRoutes);
app.use('/api/admin', adminRoutes); // <-- 2. Add the Admin Router

// A simple "home" route
app.get('/', (req, res) => {
  res.send('Smart Pharmacy API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
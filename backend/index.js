import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.config.js'; 

import authRoutes from './src/routes/auth.routes.js';
import medicineRoutes from './src/routes/medicine.routes.js';
import saleRoutes from './src/routes/sale.routes.js';
import noteRoutes from './src/routes/note.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import announcementRoutes from './src/routes/announcement.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import userRoutes from './src/routes/user.routes.js';
import ticketRoutes from './src/routes/ticket.routes.js';
import supplierRoutes from './src/routes/supplier.routes.js'; 
import systemSettingsRoutes from './src/routes/systemSettings.routes.js'; // 🆕 IMPORT

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB(); 

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const rawOrigin = process.env.CORS_ORIGIN || "*";
const allowedOrigin = rawOrigin.endsWith('/') ? rawOrigin.slice(0, -1) : rawOrigin;

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Security Headers for Google Login / COOP
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🟢 STATIC FOLDER for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes); 
app.use('/api/suppliers', supplierRoutes); 
app.use('/api/settings', systemSettingsRoutes); // 🆕 ROUTE

// ✅ REBRANDED
app.get('/', (req, res) => { res.send('Zyra API is running!'); });

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
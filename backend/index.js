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

dotenv.config();
connectDB(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// ✅ REBRANDED
app.get('/', (req, res) => { res.send('Zyra API is running!'); });

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });